# OpenAPI & Swagger

## Overview

Setiap endpoint otomatis muncul di Swagger UI (`/docs`) dengan:
- Request/response schema
- Multiple examples
- Content type selector (JSON, Form, Multipart)
- Auth button (Bearer/API Key)
- Global headers

## File Generate

```
src/generated/openapi.json    # Spec OpenAPI 3.0
src/generated/openapi.ts      # TypeScript module
src/generated/routes.ts       # Route manifest
```

Hot reload: `bun run dev` otomatis regenerate saat file berubah.

## Content Types

### 1. `application/json` (default)
Bisa nested object dan array.

```ts
export const requests = {
  valid: {
    contentType: 'application/json',
    value: {
      name: 'John',
      metadata: { source: 'web' },  // nested ✅
      tags: ['a', 'b'],             // array ✅
    },
  },
};
```

### 2. `application/x-www-form-urlencoded`
Flat key-value pairs. Array dikirim sebagai comma-separated.

```ts
export const requests = {
  form: {
    contentType: 'application/x-www-form-urlencoded',
    value: {
      name: 'John',
      tags: 'greeting,test',        // array ❌ jadi string
    },
  },
};
```

### 3. `multipart/form-data`
Form + file upload.

```ts
export const requests = {
  upload: {
    contentType: 'multipart/form-data',
    value: {
      name: 'John',
      avatar: 'binary',             // jadi file picker di UI
    },
  },
};
```

## Multiple Examples

Satu endpoint bisa punya banyak examples:

```ts
export const requests = {
  valid: {
    summary: 'Valid input',
    value: { name: 'John', email: 'john@example.com' },
  },
  invalid: {
    summary: 'Missing email',
    value: { name: 'John' },
  },
  empty: {
    summary: 'Empty request',
    value: {},
  },
};
```

Di Swagger UI: dropdown **Examples** muncul.

## Grouping

Route dikelompokkan berdasarkan `groups` di `mock.config.ts`:

```ts
groups: {
  default: ['hello/*', 'auth/*'],
  users: ['users/*'],
},
```

Route yang tidak masuk group → grup **"other"**.

## Info Lengkap

Swagger UI menampilkan:
- Title, version, description
- Contact (name, email, URL)
- License
- Terms of Service
- External docs
- Server list (local + production)

Semua diatur di `mock.config.ts` bagian `info` dan `servers`.
