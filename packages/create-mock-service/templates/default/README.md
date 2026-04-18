# Mock Service

Mock API dengan OpenAPI/Swagger UI.

## Scripts

| Script | Keterangan |
|--------|-----------|
| `bun run dev` | Dev server + hot reload |
| `bun run build` | Build + type check |
| `bun run build:routes` | Generate routes & OpenAPI |

## Endpoints

| URL | Fungsi |
|-----|--------|
| `http://localhost:8787/api/*` | API mock |
| `http://localhost:8787/docs` | Swagger UI |
| `http://localhost:8787/openapi.json` | OpenAPI spec |

## Quick Start

```bash
bun install
bun run dev
```

## Tambah Endpoint

```bash
bun run create:endpoint
```

Atau manual:
```bash
# Buat folder + file
touch src/data/users/GET.ts
```

Isi file:
```ts
export const data = {
  status: 200,
  body: { users: [] },
};

export const meta = {
  description: 'Get all users',
};

export default data;
```

## Konfigurasi

Edit:
- `mock.config.ts` — basePath, auth, groups, info
- `routes.config.ts` — daftar route
- `wrangler.toml` — Cloudflare Workers config
