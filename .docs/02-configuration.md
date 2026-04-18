# Konfigurasi

## File-file Konfigurasi

```
mock.config.ts        # Konfigurasi mock service (basePath, security, groups, dll)
wrangler.toml         # Konfigurasi Cloudflare Workers
routes.config.ts      # Daftar route yang ada
tsconfig.json         # TypeScript config
package.json          # Dependencies & scripts
```

## `mock.config.ts`

File utama untuk konfigurasi mock service.

```ts
export const mockConfig = {
  // Base path untuk semua API route
  basePath: '/api',                    // bisa: '', '/api/v1', '/v2'
  
  // Path untuk Swagger UI dan OpenAPI spec
  docsPath: '/docs',                   // Swagger UI endpoint
  openApiPath: '/openapi.json',        // OpenAPI JSON endpoint
  
  // Grouping route untuk Swagger UI
  groups: {
    default: ['hello/*', 'auth/*'],    // route hello dan auth masuk group "default"
    users: ['users/*'],
    orders: ['orders/*'],
    items: ['items/*'],
  },
  
  // Security schemes (muncul di Swagger UI)
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      description: 'Bearer token JWT',
    },
    ApiKeyAuth: {
      type: 'apiKey',
      name: 'X-API-Key',
      in: 'header',
      description: 'API key dari dashboard',
    },
  },
  
  // Default security untuk semua route
  security: ['BearerAuth'],
  
  // Global headers (muncul di semua endpoint Swagger UI)
  globalHeaders: [
    { name: 'X-Request-ID', description: 'UUID unik per request', required: false },
    { name: 'X-Client-ID', description: 'ID aplikasi client', required: false },
  ],
  
  // Info untuk OpenAPI
  info: {
    title: 'Mock Service API',
    version: '2.0.0',
    description: 'Mock API untuk development',
    contact: {
      name: 'Dev Team',
      email: 'dev@company.com',
      url: 'https://company.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  
  // Server list untuk Swagger UI
  servers: [
    { url: 'http://localhost:8787', description: 'Local dev' },
    { url: 'https://api.company.com', description: 'Production' },
  ],
};

export default mockConfig;
```

## `wrangler.toml`

Konfigurasi Cloudflare Workers.

```toml
name = "my-mock-service"
main = "src/index.ts"
compatibility_date = "2024-04-01"

[vars]
ENVIRONMENT = "production"

[env.development]
vars = { ENVIRONMENT = "development" }
```

| Field | Keterangan |
|-------|-----------|
| `name` | Nama service di Cloudflare |
| `main` | Entry point file |
| `compatibility_date` | Tanggal compatibility Workers |
| `[vars]` | Environment variables |
| `[env.development]` | Environment khusus dev |

## `routes.config.ts`

Daftar route dalam format nested.

```ts
export const routes = {
  hello: {
    methods: ['GET', 'POST'],
    children: {
      $name: { methods: ['GET'] },
    },
  },
  users: {
    methods: ['GET', 'POST'],
    children: {
      $id: { methods: ['GET', 'PUT', 'DELETE'] },
    },
  },
};
```

Lihat [`10-routes-config.md`](./10-routes-config.md) untuk detail lengkap.
