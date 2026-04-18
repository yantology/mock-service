import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');
const script = join(PROJECT_ROOT, 'scripts/create-endpoint.ts');
const args = process.argv.slice(2).join(' ');

if (!args.trim()) {
  console.log('Usage: bun <path-to>/create.ts <METHOD> [<METHOD> ...]');
  console.log('');
  console.log('Examples by folder depth:');
  console.log('  From src/data/users        → bun ../create.ts GET');
  console.log('  From src/data/hello/{name} → bun ../../create.ts DELETE');
  console.log('  From src/data/a/b/c        → bun ../../../create.ts PUT');
  console.log('');
  console.log('Multiple methods:');
  console.log('  bun ../create.ts GET POST PUT');
  console.log('  bun ../create.ts GET,POST,PUT');
  process.exit(1);
}

execSync(`bun "${script}" ${args}`, { stdio: 'inherit' });
