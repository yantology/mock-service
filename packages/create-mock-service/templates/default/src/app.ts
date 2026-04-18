import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { resolveRoute } from './lib/router.js';
import { store, seedStore } from './lib/store.js';
import * as scenario from './lib/scenario.js';
import * as mockLogger from './lib/logger.js';
import type { MockContext } from './types.js';
import { manifest, registry } from './generated/routes.js';
import mockConfig from '../mock.config.js';

seedStore();

const app = new Hono();
const basePath = mockConfig.basePath;
const apiPrefix = basePath === '' ? '' : `${basePath}`;
const apiPattern = apiPrefix === '' ? '*' : `${apiPrefix}/*`;
const apiPath = (path: string) => (apiPrefix === '' ? path : `${apiPrefix}${path}`);

// Collision detection: check if docsPath or openApiPath conflicts with API routes
function detectCollision(configPath: string, type: string) {
  const normalizedPath = configPath.replace(/^\//, '');
  for (const routePath of Object.keys(manifest)) {
    if (routePath === normalizedPath || routePath.startsWith(normalizedPath + '/')) {
      throw new Error(
        `COLLISION: ${type} path "${configPath}" conflicts with API route "${routePath}". ` +
        `Please change ${type}Path in mock.config.ts to avoid conflict.`
      );
    }
  }
}

detectCollision(mockConfig.openApiPath, 'openApi');
detectCollision(mockConfig.docsPath, 'docs');

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use('*', logger());

app.use('*', async (c, next) => {
  const delay = Number(c.req.header('X-Mock-Delay') || 0);
  if (delay > 0) {
    await new Promise((r) => setTimeout(r, delay));
  }
  await next();
});

app.use(apiPattern, async (c, next) => {
  const start = performance.now();
  await next();
  const duration = Math.round(performance.now() - start);

  let body: unknown = null;
  if (['POST', 'PUT', 'PATCH'].includes(c.req.method)) {
    try {
      const cloned = c.req.raw.clone();
      body = await cloned.json();
    } catch {
      body = null;
    }
  }

  mockLogger.addLog({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    method: c.req.method,
    path: c.req.path,
    query: Object.fromEntries(new URL(c.req.url).searchParams),
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    body,
    responseStatus: c.res.status,
    durationMs: duration,
    scenario: c.req.header('X-Mock-Scenario') || scenario.getScenario(c.req.path),
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'healthy', version: mockConfig.info.version, timestamp: new Date().toISOString() });
});

// OpenAPI spec endpoint — read from JSON file for hot reload support
app.get(mockConfig.openApiPath, async (c) => {
  try {
    // Try reading JSON file first (works in dev mode with Bun)
    const bun = (globalThis as any).Bun;
    if (bun) {
      const jsonPath = new URL('./generated/openapi.json', import.meta.url);
      const file = bun.file(jsonPath);
      if (await file.exists()) {
        const spec = await file.json();
        return c.json(spec);
      }
    }
    // Fallback: import TS module
    const { default: openApiSpec } = await import('./generated/openapi.js');
    return c.json(openApiSpec);
  } catch {
    return c.json({ error: 'OpenAPI spec not generated yet. Run bun run build:routes.' }, 404);
  }
});

// Swagger UI endpoint
app.get(mockConfig.docsPath, (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mockConfig.info.title} - API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #f5f5f5; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 30px 0; }
    .swagger-ui .info .title { 
      font-size: 36px; 
      font-weight: 700; 
      color: #333;
      margin-bottom: 10px;
    }
    .swagger-ui .info .description { 
      font-size: 16px; 
      color: #666; 
      margin: 15px 0;
      line-height: 1.5;
    }
    .swagger-ui .info .contact,
    .swagger-ui .info .license,
    .swagger-ui .info .tos {
      margin: 10px 0;
      font-size: 14px;
      color: #888;
    }
    .swagger-ui .info a { color: #4990e2; text-decoration: none; }
    .swagger-ui .info a:hover { text-decoration: underline; }
    .swagger-ui .scheme-container { 
      background: #fff; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin: 0 0 20px;
      padding: 20px;
    }
    .swagger-ui .opblock { 
      border-radius: 8px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 0 0 15px;
      border: none;
    }
    .swagger-ui .opblock .opblock-summary { padding: 15px; }
    .swagger-ui .opblock-tag { 
      font-size: 20px; 
      font-weight: 600;
      margin: 30px 0 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #eee;
    }
    .swagger-ui section.models { 
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '${mockConfig.openApiPath}',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.presets.standalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      tryItOutEnabled: true,
      syntaxHighlight: {
        activated: true,
        theme: 'agate'
      },
      persistAuthorization: true,
      requestInterceptor: function(request) {
        return request;
      },
      supportedSubmitMethods: ['get','post','put','delete','patch','options','head']
    });
  </script>
</body>
</html>`;
  return c.html(html);
});

app.get(apiPath('/__routes'), (c) => {
  const routes = Object.entries(manifest).flatMap(([path, methods]) =>
    Object.keys(methods).map((method) => ({ method, path: apiPath(`/${path}`) }))
  );
  return c.json({ totalRoutes: routes.length, routes });
});

app.get(apiPath('/__registry'), (c) => {
  const data = Object.entries(registry).map(([routePath, methods]) => ({
    route: apiPath(`/${routePath}`),
    methods: Object.entries(methods).map(([method, scenarios]) => ({
      method,
      scenarios: scenarios.length > 0 ? scenarios : ['(default only)'],
    })),
  }));
  return c.json({ data });
});

app.get(apiPath('/__registry/*'), (c) => {
  const prefix = apiPath('/__registry/');
  const routePath = c.req.path.replace(new RegExp(`^${prefix.replace(/\//g, '\\/')}`), '');
  const methods = registry[routePath];
  if (!methods) {
    return c.json({ error: 'Route not found in registry' }, 404);
  }
  return c.json({
    data: {
      route: apiPath(`/${routePath}`),
      methods: Object.entries(methods).map(([method, scenarios]) => ({
        method,
        scenarios: scenarios.length > 0 ? scenarios : ['(default only)'],
      })),
    },
  });
});

app.post(apiPath('/__reset'), (c) => {
  store.clear();
  scenario.clearScenarios();
  mockLogger.clearLogs();
  seedStore();
  return c.json({ message: 'Mock state reset to defaults' });
});

app.get(apiPath('/__logs'), (c) => {
  const limit = Number(c.req.query('limit') || '50');
  return c.json({ data: mockLogger.getLogs(limit) });
});

app.delete(apiPath('/__logs'), (c) => {
  mockLogger.clearLogs();
  return c.json({ message: 'Logs cleared' });
});

app.get(apiPath('/__scenarios'), (c) => {
  return c.json({ data: scenario.listScenarios() });
});

app.post(apiPath('/__scenarios'), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { route, scenario: sc } = body;
  if (!route || !sc) {
    return c.json({ error: 'route and scenario are required' }, 400);
  }
  scenario.setScenario(route, sc);
  return c.json({ message: `Scenario for ${route} set to "${sc}"` });
});

app.delete(apiPath('/__scenarios'), (c) => {
  scenario.clearScenarios();
  return c.json({ message: 'Scenarios cleared' });
});

app.all(apiPattern, async (c) => {
  const url = new URL(c.req.url);
  const path = url.pathname;
  const method = c.req.method;

  const scenarioName = c.req.header('X-Mock-Scenario') || scenario.getScenario(path);

  const resolved = resolveRoute(path, method, scenarioName);
  if (!resolved) {
    return c.json({ error: 'Endpoint not found' }, 404);
  }

  const { handler, pathParams } = resolved;

  let body: Record<string, unknown> | null = null;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await c.req.json();
    } catch {
      body = {};
    }
  }

  const authHeader = c.req.header('Authorization') || '';
  let userId: string | null = null;
  if (authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const base64Url = token.split('.')[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        userId = payload?.sub || null;
      }
    } catch {
      userId = null;
    }
  }

  const ctx: MockContext = {
    userId,
    body,
    params: Object.fromEntries(url.searchParams),
    pathParams,
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    store,
    scenario: scenarioName || 'default',
  };

  try {
    const result = await handler(ctx);

    if (result && typeof result === 'object' && result.constructor === Response) {
      return result as Response;
    }

    if (result && typeof result === 'object' && 'status' in result && 'body' in result) {
      return c.json((result as { body: unknown }).body, (result as { status: number }).status as any);
    }

    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message || 'Internal server error' }, 500);
  }
});

export default app;
