# Auth & Security

## Security Schemes

Diatur di `mock.config.ts`:

```ts
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
  BasicAuth: {
    type: 'http',
    scheme: 'basic',
    description: 'Basic username:password',
  },
},
```

## Tipe Security

| Tipe | Header | Format | Contoh |
|------|--------|--------|--------|
| `http` + `bearer` | `Authorization` | `Bearer <token>` | `Bearer eyJhbGc...` |
| `http` + `basic` | `Authorization` | `Basic <base64>` | `Basic YWRtaW46c2VjcmV0` |
| `apiKey` | Custom | Langsung value | `X-API-Key: abc123` |

## Default Security

```ts
security: ['BearerAuth'],   // Semua route butuh BearerAuth
```

## Disable Auth per Route

```ts
export const meta = {
  description: 'Login endpoint',
  security: false,            // Route ini tidak butuh auth
};
```

## Multiple Auth

```ts
// Route butuh Bearer ATAU ApiKey
export const meta = {
  security: ['BearerAuth', 'ApiKeyAuth'],
};
```

## Global Headers

Muncul di semua endpoint Swagger UI:

```ts
globalHeaders: [
  { name: 'X-Request-ID', description: 'UUID unik', required: false },
  { name: 'X-Client-ID', description: 'App ID', required: false },
],
```

## Route-specific Headers

```ts
export const meta = {
  headers: [
    { name: 'X-Mock-Scenario', description: 'Nama scenario', required: false },
    { name: 'X-Mock-Delay', description: 'Delay dalam ms', required: false },
  ],
};
```

## Swagger UI

Klik tombol **Authorize** di atas untuk:
1. Isi Bearer token
2. Isi API Key
3. Token tersimpan saat refresh browser (`persistAuthorization`)

Semua request ke endpoint yang butuh auth otomatis menyertakan token.
