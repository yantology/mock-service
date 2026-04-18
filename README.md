# Mock Service API

A zero-config mock API service with OpenAPI/Swagger UI support for frontend development.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run build` | Build + type check (for CI) |
| `bun run build:routes` | Generate route manifest & OpenAPI spec |
| `bun run lint` | TypeScript type checking |
| `bun run create:endpoint` | Generate new handler file |
| `bun run scaffold` | Sync config ↔ filesystem |
| `bun run dump:routes` | Scan existing routes → update config |

## Endpoints (Development)

| URL | Description |
|-----|-------------|
| `http://localhost:8787/api/*` | Mock API endpoints |
| `http://localhost:8787/docs` | Swagger UI (interactive docs) |
| `http://localhost:8787/openapi.json` | OpenAPI spec (raw JSON) |

## Quick Start

```bash
cd packages/mock-service
bun install
bun run dev          # http://localhost:8787
```

## Add Endpoint

```bash
# Generate handler file
bun run create:endpoint

# Or manual - create file in src/data/
touch src/data/users/GET.ts
```

Example handler:
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

## Full Documentation

See [`.docs/`](./.docs/) for detailed guides:

- [`01-philosophy.md`](./.docs/01-philosophy.md) — Concept & philosophy
- [`02-configuration.md`](./.docs/02-configuration.md) — Configuration (mock.config.ts, wrangler.toml)
- [`03-routing.md`](./.docs/03-routing.md) — Routing convention
- [`04-openapi.md`](./.docs/04-openapi.md) — OpenAPI/Swagger setup
- [`05-scenarios.md`](./.docs/05-scenarios.md) — Scenario switching
- [`06-store.md`](./.docs/06-store.md) — Stateful store
- [`07-handler-format.md`](./.docs/07-handler-format.md) — Handler file format
- [`08-security.md`](./.docs/08-security.md) — Auth & security setup
- [`09-deployment.md`](./.docs/09-deployment.md) — Deploy to Cloudflare
- [`10-routes-config.md`](./.docs/10-routes-config.md) — Routes config & scaffold
