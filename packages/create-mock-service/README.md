# create-mock-service

A CLI tool to generate mock API service projects with OpenAPI/Swagger UI support.

## Installation

No installation required. Use with `npx`:

```bash
npx create-mock-service my-api
```

## Usage

### Interactive Mode
```bash
npx create-mock-service
```

### Direct Mode
```bash
npx create-mock-service my-api
```

## Requirements

- Node.js 18+
- Bun (recommended) or npm

## What You Get

A new project with:
- ✅ Mock API server (Hono + Cloudflare Workers)
- ✅ Auto OpenAPI spec generation
- ✅ Interactive Swagger UI (`/docs`)
- ✅ Hot reload development
- ✅ Multiple request examples (JSON, Form, Multipart)
- ✅ Auth & security setup
- ✅ Scenario switching for testing

## Quick Start

```bash
npx create-mock-service my-api

cd my-api
bun install
bun run dev

# Open http://localhost:8787/docs
```

## Features

| Feature | Description |
|---------|-------------|
| **File-based Routing** | `src/data/hello/GET.ts` → `GET /api/hello` |
| **Auto OpenAPI** | Generate spec from handler files |
| **Swagger UI** | Interactive docs with Try-it-out |
| **Multiple Content Types** | JSON, Form, Multipart support |
| **Auth Security** | Bearer Token, API Key setup |
| **Scenarios** | Test error cases easily |

## Project Scripts

After generating a project:

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server + hot reload |
| `bun run build` | Build + type check |
| `bun run build:routes` | Generate routes & OpenAPI spec |
| `bun run create:endpoint` | Generate new handler file |
| `bun run scaffold` | Sync config ↔ filesystem |
| `bun run dump:routes` | Scan existing routes → update config |

### Scaffold (Config → Files)
Sync `routes.config.ts` to filesystem. Creates missing files, removes unregistered ones.

```bash
bun run scaffold
```

### Dump (Files → Config)
Scan `src/data/` folder and update `routes.config.ts` to match existing files.

```bash
bun run dump:routes
```

### Create Single Endpoint
Generate one handler file:

```bash
bun run create:endpoint
```

## Example Handler

```ts
// src/data/hello/GET.ts
export const data = {
  status: 200,
  body: { message: 'Hello World!' },
};

export const meta = {
  description: 'Get hello message',
};

export default data;
```

## Documentation

After generating a project, see the `README.md` in the generated project for full documentation.

## License

MIT
