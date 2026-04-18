# create-mock-service

CLI tool untuk generate mock API service dengan OpenAPI/Swagger UI support.

## Install

```bash
npx create-mock-service my-api
```

## Usage

```bash
# Interactive mode
npx create-mock-service

# Direct mode
npx create-mock-service my-api
```

## Requirements

- Node.js 18+
- Bun (recommended) atau npm

## What You Get

Project baru dengan:
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
| **Auto OpenAPI** | Generate spec dari file handler |
| **Swagger UI** | Interactive docs with Try-it-out |
| **Multiple Content Types** | JSON, Form, Multipart support |
| **Auth Security** | Bearer Token, API Key setup |
| **Scenarios** | Test error cases easily |

## Scripts

Setelah generate project:

```bash
bun run dev       # Dev server + hot reload
bun run build     # Build + type check
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

Setelah generate project, lihat `README.md` di project tersebut untuk dokumentasi lengkap.

## License

MIT
