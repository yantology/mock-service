import { readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const DATA_DIR = join(PROJECT_ROOT, 'src', 'data');

interface RouteNode {
  methods?: string[];
  children?: Record<string, RouteNode>;
}

// Convert {param} folder → $param config key
function toConfigKey(folderName: string): string {
  const match = folderName.match(/^\{(.+)\}$/);
  if (match) {
    return '$' + match[1];
  }
  return folderName;
}

function scanDir(dir: string): RouteNode {
  const node: RouteNode = { methods: [], children: {} };

  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const st = statSync(fullPath);

    if (st.isDirectory()) {
      const configKey = toConfigKey(name);
      node.children![configKey] = scanDir(fullPath);
    } else if (st.isFile() && name.endsWith('.ts')) {
      const method = name.replace(/\.ts$/, '');
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) continue;
      node.methods!.push(method);
    }
  }

  if (node.methods && node.methods.length === 0) {
    delete node.methods;
  }
  if (node.children && Object.keys(node.children).length === 0) {
    delete node.children;
  }

  return node;
}

function serializeNode(node: RouteNode, indent: string): string {
  const lines: string[] = [];

  if (node.methods && node.methods.length > 0) {
    const methodsStr = node.methods
      .sort()
      .map((m) => `'${m}'`)
      .join(', ');
    lines.push(`${indent}methods: [${methodsStr}],`);
  }

  if (node.children && Object.keys(node.children).length > 0) {
    lines.push(`${indent}children: {`);
    const childEntries = Object.entries(node.children).sort(([a], [b]) => a.localeCompare(b));
    for (let i = 0; i < childEntries.length; i++) {
      const [childName, childNode] = childEntries[i];
      const needsQuotes = childName.includes('-') || childName.includes('.') || /^\d/.test(childName);
      const displayName = needsQuotes ? `'${childName}'` : childName;
      lines.push(`${indent}  ${displayName}: {`);
      lines.push(serializeNode(childNode, `${indent}    `));
      lines.push(`${indent}  },`);
    }
    lines.push(`${indent}},`);
  }

  return lines.join('\n');
}

function main() {
  const routes: Record<string, RouteNode> = {};

  for (const name of readdirSync(DATA_DIR)) {
    const fullPath = join(DATA_DIR, name);
    if (statSync(fullPath).isDirectory()) {
      const configKey = toConfigKey(name);
      routes[configKey] = scanDir(fullPath);
    }
  }

  const lines = [
    '// routes.config.ts',
    '// Single source of truth for all API endpoints',
    '// Format: { path: string, methods: string[], children?: Routes }',
    '// Dynamic params use $paramName syntax (maps to {paramName} in filesystem)',
    '',
    'export const routes = {',
  ];

  const entries = Object.entries(routes).sort(([a], [b]) => a.localeCompare(b));

  for (let i = 0; i < entries.length; i++) {
    const [path, node] = entries[i];
    lines.push(`  ${path}: {`);
    lines.push(serializeNode(node, '    '));
    lines.push('  },');
    if (i < entries.length - 1) {
      lines.push('');
    }
  }

  lines.push('};', '', 'export default routes;', '');

  const fs = require('node:fs');
  const configPath = join(PROJECT_ROOT, 'routes.config.ts');
  fs.writeFileSync(configPath, lines.join('\n'), 'utf-8');

  console.log('Updated routes.config.ts');
  console.log(`Total top-level routes: ${entries.length}`);
}

main();
