# Routing

## Convention

Folder structure = API path.

```
src/data/hello/GET.ts        →  GET /api/hello
src/data/hello/POST.ts       →  POST /api/hello
src/data/items/{id}/GET.ts   →  GET /api/items/:id
```

## Supported Methods

- `GET.ts`
- `POST.ts`
- `PUT.ts`
- `PATCH.ts`
- `DELETE.ts`

## Dynamic Parameters

Gunakan kurung kurawal di nama folder:

```
src/data/orders/{orderId}/items/{itemId}/GET.ts
```

Akses di handler:

```ts
export const data = ({ pathParams }) => ({
  status: 200,
  body: { orderId: pathParams.orderId, itemId: pathParams.itemId },
});
```

## CLI Generator

```bash
# Dari dalam folder target
bun ../create.ts GET POST

# Hasil: src/data/target/GET.ts, POST.ts
```

## Context Properties

| Property | Type | Keterangan |
|----------|------|-----------|
| `userId` | `string \| null` | Dari JWT decode |
| `body` | `Record<string, unknown> \| null` | Request body |
| `params` | `Record<string, string>` | Query parameters |
| `pathParams` | `Record<string, string>` | Dynamic URL segments |
| `headers` | `Record<string, string>` | Request headers |
| `store` | `MockStore` | In-memory store |
| `scenario` | `string` | Scenario aktif |

## Route Manifest

```bash
bun run build:routes
```

Generate `src/generated/routes.ts` dan `src/generated/openapi.json`.
Wajib di-regenerate setelah tambah file baru.
