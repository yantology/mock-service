import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
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

function detectPathFromCwd(): string | null {
  const cwd = process.cwd().replace(/\\/g, '/').toLowerCase();
  const dataDir = DATA_DIR.replace(/\\/g, '/').toLowerCase();
  if (cwd.startsWith(dataDir)) {
    return cwd.slice(dataDir.length).replace(/^\//, '');
  }
  return null;
}

function listDataPaths(): string[] {
  const paths: string[] = [];
  function scan(dir: string) {
    for (const name of readdirSync(dir)) {
      const fullPath = join(dir, name);
      if (statSync(fullPath).isDirectory()) {
        const rel = relative(DATA_DIR, fullPath).split(sep).join('/');
        paths.push(rel);
        scan(fullPath);
      }
    }
  }
  try {
    scan(DATA_DIR);
  } catch {
    // ignore
  }
  return paths.sort();
}

const VALID_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function isValidMethod(m: string): boolean {
  return VALID_METHODS.includes(m.toUpperCase());
}

function parseMethods(input: string): string[] {
  return input
    .split(/[,\s]+/)
    .map((m) => m.trim().toUpperCase())
    .filter((m) => m.length > 0 && isValidMethod(m));
}

async function pickPath(): Promise<string | null> {
  const paths = listDataPaths();
  if (paths.length === 0) return null;

  console.log('Available paths:');
  paths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
  console.log('  0. [type new path]');

  const choice = (await ask('Select number or type path: ')).trim();
  const num = Number(choice);
  if (!isNaN(num) && num >= 1 && num <= paths.length) {
    return paths[num - 1];
  }
  if (choice) return choice;
  return null;
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

async function main() {
  const pathFromCwd = detectPathFromCwd();
  const methodArg = process.argv.slice(2).join(',');

  let path: string;
  let methods: string[];

  if (pathFromCwd) {
    path = pathFromCwd;
    if (methodArg) {
      methods = parseMethods(methodArg);
      if (methods.length === 0) {
        const input = (await ask('HTTP method (GET/POST/PUT/PATCH/DELETE): ')).trim();
        methods = parseMethods(input);
      }
    } else {
      const input = (await ask('HTTP method (GET/POST/PUT/PATCH/DELETE): ')).trim();
      methods = parseMethods(input);
    }
  } else {
    const allArgs = process.argv.slice(2).join(',');
    const firstArg = process.argv[2] || '';
    if (process.argv.length >= 3 && !isValidMethod(firstArg) && parseMethods(firstArg).length === 0) {
      path = firstArg;
      const secondArg = process.argv.slice(3).join(',');
      if (secondArg) {
        methods = parseMethods(secondArg);
      } else {
        const input = (await ask('HTTP method (GET/POST/PUT/PATCH/DELETE): ')).trim();
        methods = parseMethods(input);
      }
    } else if (process.argv.length >= 3 && (isValidMethod(firstArg) || parseMethods(allArgs).length > 0)) {
      console.log('API path not specified. Please select an existing path or type a new one.');
      const picked = await pickPath();
      if (!picked) {
        console.log('No path selected');
        rl.close();
        return;
      }
      path = picked;
      methods = parseMethods(allArgs);
    } else {
      const picked = await pickPath();
      if (!picked) {
        const inputPath = (await ask('API path (e.g. users, orders/{id}): ')).trim();
        if (!inputPath) {
          console.log('Path is required');
          rl.close();
          return;
        }
        path = inputPath;
      } else {
        path = picked;
      }
      const inputMethod = (await ask('HTTP method (GET/POST/PUT/PATCH/DELETE): ')).trim();
      methods = parseMethods(inputMethod);
    }
  }

  if (methods.length === 0) {
    console.log('No valid methods provided');
    rl.close();
    return;
  }

  let anyCreated = false;

  for (const method of methods) {
    const filePath = join(DATA_DIR, path, `${method}.ts`);
    if (existsSync(filePath)) {
      console.log('File already exists: src/data/' + path + '/' + method + '.ts');
      continue;
    }
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, getContent(method), 'utf-8');
    console.log('Created: src/data/' + path + '/' + method + '.ts');
    anyCreated = true;
  }

  if (anyCreated) {
    console.log('Building routes...');
    execSync('bun run build:routes', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  } else {
    console.log('No new files created.');
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
