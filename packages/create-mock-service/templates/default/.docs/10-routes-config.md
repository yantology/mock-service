# Routes Config & Scaffold

## `routes.config.ts`

Single source of truth untuk semua endpoint.

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
  
  auth: {
    methods: ['POST'],
    children: {
      login: { methods: ['POST'] },
      logout: { methods: ['POST'] },
      session: { methods: ['GET'] },
    },
  },
};
```

**Note:** `$param` untuk dynamic parameter. Auto convert ke `{param}` di filesystem.

## Scaffold

Generate file dari config:

```bash
bun run scaffold
```

Preview sebelum execute:

```
📋 Scaffold Preview
═══════════════════════

✅ Will CREATE (3 files):
   + src/data/auth/login/POST.ts
   + src/data/auth/logout/POST.ts
   + src/data/auth/session/GET.ts

🗑️  Will DELETE (1 files):
   - src/data/old/GET.ts

Proceed? (y/n):
```

## Dump

Sync config dari filesystem yang sudah ada:

```bash
bun run dump:routes
```

## Workflow

### Plan First (Config → Code)
1. Edit `routes.config.ts`
2. `bun run scaffold`
3. Isi response body di tiap file

### Organic Growth (Code → Config)
1. Bikin endpoint manual
2. `bun run dump:routes`
3. Config otomatis ter-update
