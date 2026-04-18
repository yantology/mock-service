# Deployment

## Local Development

```bash
bun run dev
```

Menjalankan Wrangler dev server di port `8787`.

Auto features:
- Hot reload routes
- Auto generate OpenAPI spec
- Watch file changes

## Build

```bash
bun run build
```

Menjalankan:
1. `bun run build:routes` — generate routes & OpenAPI
2. `bun run lint` — type check

## Deploy

### Cloudflare Workers

```bash
npx wrangler deploy
```

### Environment Variables

```toml
# wrangler.toml
[vars]
ENVIRONMENT = "production"
API_VERSION = "v2"

[env.development]
vars = { ENVIRONMENT = "development" }
```

### Secrets

```bash
npx wrangler secret put MY_SECRET
```

## CI/CD Pipeline

```yaml
steps:
  - bun install
  - bun run build
  - npx wrangler deploy
```

## Wrangler Commands

| Command | Keterangan |
|---------|-----------|
| `wrangler dev` | Local dev |
| `wrangler dev --remote` | Dev dengan remote Workers |
| `wrangler deploy` | Deploy ke production |
| `wrangler login` | Login ke Cloudflare |
