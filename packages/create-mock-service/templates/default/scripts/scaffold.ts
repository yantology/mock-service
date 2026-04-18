import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const DATA_DIR = join(PROJECT_ROOT, 'src', 'data');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q: string): Promise<string> {
  return new Promise((resolve) => rl.question(q, resolve));
}

interface RouteNode {
  methods?: string[];
  children?: Record<string, RouteNode>;
}

// Convert $param → {param} for filesystem
function toFolderName(key: string): string {
  if (key.startsWith('$')) {
    return '{' + key.slice(1) + '}';
  }
  return key;
}

// Convert {param} → $param for config
function toConfigKey(folderName: string): string {
  const match = folderName.match(/^\{(.+)\}$/);
  if (match) {
    return '$' + match[1];
  }
  return folderName;
}

function getContent(method: string): string {
  if (method === 'GET') {
    return `export const data = {\n  status: 200,\n  body: {},\n};\n\nexport default data;\n`;
  }
  if (method === 'DELETE') {
    return `export const data = {\n  status: 204,\n  body: null,\n};\n\nexport default data;\n`;
  }
  if (method === 'POST') {
    return `export const data = {\n  status: 201,\n  body: {},\n};\n\nexport default data;\n`;
  }
  return `export const data = {\n  status: 200,\n  body: {},\n};\n\nexport default data;\n`;
}

function collectExpectedFiles(
  node: RouteNode,
  currentPath: string,
  expected: Set<string>
) {
  if (node.methods && Array.isArray(node.methods)) {
    for (const method of node.methods) {
      expected.add(join(DATA_DIR, currentPath, `${method}.ts`));
    }
  }

  if (node.children) {
    for (const [childName, childNode] of Object.entries(node.children)) {
      const folderName = toFolderName(childName);
      const childPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      collectExpectedFiles(childNode, childPath, expected);
    }
  }
}

function collectExistingFiles(dir: string, existing: Set<string>) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const st = statSync(fullPath);
    if (st.isDirectory()) {
      collectExistingFiles(fullPath, existing);
    } else if (st.isFile() && name.endsWith('.ts')) {
      const method = name.replace(/\.ts$/, '');
      if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        existing.add(fullPath);
      }
    }
  }
}

function collectEmptyDirs(dir: string, emptyDirs: string[]) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const st = statSync(fullPath);
    if (st.isDirectory()) {
      collectEmptyDirs(fullPath, emptyDirs);
      const contents = readdirSync(fullPath);
      if (contents.length === 0) {
        emptyDirs.push(fullPath);
      }
    }
  }
}

async function main() {
  const config = await import(join(PROJECT_ROOT, 'routes.config.ts'));
  const routes = config.default || config.routes;

  if (!routes || typeof routes !== 'object') {
    console.error('Invalid routes config');
    rl.close();
    process.exit(1);
  }

  const expected = new Set<string>();
  const existing = new Set<string>();

  for (const [path, node] of Object.entries(routes)) {
    collectExpectedFiles(node as RouteNode, path, expected);
  }

  if (existsSync(DATA_DIR)) {
    collectExistingFiles(DATA_DIR, existing);
  }

  const toCreate: string[] = [];
  const toDelete: string[] = [];

  for (const file of expected) {
    if (!existing.has(file)) {
      toCreate.push(file);
    }
  }

  for (const file of existing) {
    if (!expected.has(file)) {
      toDelete.push(file);
    }
  }

  console.log('\n📋 Scaffold Preview');
  console.log('═══════════════════════\n');

  if (toCreate.length > 0) {
    console.log(`✅ Will CREATE (${toCreate.length} files):`);
    for (const file of toCreate.sort()) {
      const rel = file.replace(DATA_DIR + '\\', '').replace(/\\/g, '/');
      console.log(`   + src/data/${rel}`);
    }
    console.log('');
  }

  if (toDelete.length > 0) {
    console.log(`🗑️  Will DELETE (${toDelete.length} files):`);
    for (const file of toDelete.sort()) {
      const rel = file.replace(DATA_DIR + '\\', '').replace(/\\/g, '/');
      console.log(`   - src/data/${rel}`);
    }
    console.log('');
  }

  if (toCreate.length === 0 && toDelete.length === 0) {
    console.log('✨ Everything is already in sync.\n');
    rl.close();
    return;
  }

  const answer = (await ask('Proceed? (y/n): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') {
    console.log('❌ Cancelled.\n');
    rl.close();
    return;
  }

  for (const file of toCreate) {
    mkdirSync(dirname(file), { recursive: true });
    const method = file.replace(/.*\\/, '').replace('.ts', '');
    writeFileSync(file, getContent(method), 'utf-8');
    const rel = file.replace(DATA_DIR + '\\', '').replace(/\\/g, '/');
    console.log(`   ✅ Created: src/data/${rel}`);
  }

  for (const file of toDelete) {
    rmSync(file);
    const rel = file.replace(DATA_DIR + '\\', '').replace(/\\/g, '/');
    console.log(`   🗑️  Deleted: src/data/${rel}`);
  }

  const emptyDirs: string[] = [];
  collectEmptyDirs(DATA_DIR, emptyDirs);
  for (const dir of emptyDirs.sort().reverse()) {
    try {
      rmSync(dir, { recursive: true });
      const rel = dir.replace(DATA_DIR + '\\', '').replace(/\\/g, '/');
      console.log(`   📁 Removed empty dir: src/data/${rel}`);
    } catch {
      // ignore
    }
  }

  console.log('\n🔄 Building routes...');
  execSync('bun run build:routes', { cwd: PROJECT_ROOT, stdio: 'inherit' });

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
