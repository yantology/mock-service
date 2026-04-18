# Format File Handler

## Struktur File

```ts
// 1. Response default
export const data = {
  status: 200,
  body: { message: 'Hello' },
};

// 2. Scenarios (optional)
export const scenarios = {
  error: {
    status: 500,
    body: { error: 'Server error' },
    description: 'Simulate error',
  },
};

// 3. Metadata (optional)
export const meta = {
  description: 'Hello endpoint',
  // Override security untuk route ini
  security: false,                    // disable auth
  // Route-specific headers
  headers: [
    { name: 'X-Mock-Scenario', description: 'Test scenario', required: false },
  ],
};

// 4. Request examples (optional)
export const requests = {
  valid: {
    summary: 'Valid input',
    contentType: 'application/json',
    value: {
      name: 'John',
      email: 'john@example.com',
    },
  },
  form: {
    summary: 'Form input',
    contentType: 'application/x-www-form-urlencoded',
    value: {
      name: 'John',
      message: 'Hello',
    },
  },
  upload: {
    summary: 'With file',
    contentType: 'multipart/form-data',
    value: {
      name: 'John',
      avatar: 'binary',               // file picker di Swagger UI
    },
  },
};

// 5. Default export
export default data;
```

## Export Wajib

| Export | Wajib | Keterangan |
|--------|-------|-----------|
| `data` | ✅ | Response default atau function handler |
| `scenarios` | ❌ | Variasi response untuk testing |
| `meta` | ❌ | Deskripsi, security override, headers |
| `requests` | ❌ | Multiple request examples |
| `default` | ✅ | Alias untuk `data` |

## Handler Function

```ts
import type { MockContext } from '../../types.js';

export const data = ({ pathParams, body, store, userId }: MockContext) => {
  return {
    status: 200,
    body: {
      id: pathParams.id,
      user: userId,
      data: body,
    },
  };
};
```

## Response Format

```ts
// Object dengan status + body
{ status: 201, body: { id: '123' } }

// Plain object (auto status 200)
{ message: 'Hello' }

// Raw Response
new Response('Plain text', { status: 200 })
```

## Tipe Data

```ts
export const requests = {
  // String
  name: { type: 'string', value: 'John' },
  
  // Number
  age: { type: 'number', value: 25 },
  
  // Boolean
  active: { type: 'boolean', value: true },
  
  // Array
  tags: { type: 'array', value: ['a', 'b', 'c'] },
  
  // Nested object (hanya JSON)
  metadata: {
    type: 'object',
    value: { source: 'web', version: '2.0' },
  },
  
  // File upload (multipart only)
  avatar: { type: 'file', value: 'binary' },
};
```

## Content Types

| Content Type | Nested | Array | File | Kegunaan |
|-------------|--------|-------|------|----------|
| `application/json` | ✅ | ✅ | ❌ | Default, API modern |
| `application/x-www-form-urlencoded` | ❌ | ⚠️ | ❌ | Form HTML biasa |
| `multipart/form-data` | ❌ | ⚠️ | ✅ | Form + file upload |
| `text/plain` | ❌ | ❌ | ❌ | Raw text |

**Note:** Form dan Multipart tidak support nested object. Array dikirim sebagai repeated field (`tags[]=a&tags[]=b`) atau comma-separated string.
