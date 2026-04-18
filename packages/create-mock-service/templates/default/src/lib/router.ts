import { manifest, registry } from '../generated/routes.js';
import type { MockContext, MockHandler, MockHandlerResult } from '../types.js';
import mockConfig from '../../mock.config.js';

interface ResolvedRoute {
  handler: (ctx: MockContext) => MockHandlerResult | Promise<MockHandlerResult>;
  pathParams: Record<string, string>;
  availableScenarios: string[];
}

function normalizeHandler(handler: MockHandler) {
  return typeof handler === 'function'
    ? handler
    : () => handler;
}

function stripDescription(result: MockHandlerResult): MockHandlerResult {
  if (result && typeof result === 'object' && !('constructor' in result && result.constructor === Response) && 'body' in result && 'status' in result) {
    const { body, status } = result as { body: unknown; status: number; description?: string };
    return { body, status };
  }
  return result;
}

export function resolveRoute(path: string, method: string, scenario: string): ResolvedRoute | null {
  const basePath = mockConfig.basePath === '' ? '' : mockConfig.basePath;
  const prefixPattern = basePath === '' ? /^\// : new RegExp(`^${basePath.replace(/\//g, '\\/')}/`);
  const routePath = path.replace(prefixPattern, '');

  // Exact match
  const exactModule = manifest[routePath]?.[method];
  if (exactModule) {
    const selected = scenario && exactModule.scenarios?.[scenario]
      ? exactModule.scenarios[scenario]
      : exactModule.data;

    const rawHandler = normalizeHandler(selected);
    const handler = async (ctx: MockContext) => {
      const result = await rawHandler(ctx);
      return stripDescription(result);
    };

    return {
      handler,
      pathParams: {},
      availableScenarios: registry[routePath]?.[method] || [],
    };
  }

  // Dynamic match
  const parts = routePath.split('/').filter(Boolean);
  for (const [pattern, methods] of Object.entries(manifest)) {
    if (!methods[method]) continue;
    const patternParts = pattern.split('/').filter(Boolean);
    if (patternParts.length !== parts.length) continue;

    const pathParams: Record<string, string> = {};
    let match = true;
    for (let i = 0; i < patternParts.length; i++) {
      const pp = patternParts[i];
      if (pp.startsWith('{') && pp.endsWith('}')) {
        pathParams[pp.slice(1, -1)] = parts[i];
      } else if (pp !== parts[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      const module = methods[method];
      const selected = scenario && module.scenarios?.[scenario]
        ? module.scenarios[scenario]
        : module.data;

      const rawHandler = normalizeHandler(selected);
      const handler = async (ctx: MockContext) => {
        const result = await rawHandler(ctx);
        return stripDescription(result);
      };

      return {
        handler,
        pathParams,
        availableScenarios: registry[pattern]?.[method] || [],
      };
    }
  }

  return null;
}
