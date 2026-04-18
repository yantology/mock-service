# Stateful Store

In-memory key-value store. Data bertahan selama server running.

## Seed Data

Saat startup, store diisi default data via `seedStore()` di `src/lib/store.ts`.

## Read & Write

```ts
export const data = ({ store, body }: MockContext) => {
  const items = (store.get('items') as any[]) || [];
  items.push({ id: crypto.randomUUID(), name: body?.name });
  store.set('items', items);
  return { status: 201, body: items };
};
```

## API Store

| Method | Keterangan |
|--------|-----------|
| `store.get(key)` | Ambil value |
| `store.set(key, value)` | Simpan value |
| `store.delete(key)` | Hapus key |
| `store.clear()` | Kosongkan semua |
| `store.has(key)` | Cek key ada |
| `store.snapshot()` | Ambil semua data |

## Reset

```bash
POST /api/__reset
```

- `store.clear()`
- Reset scenarios
- Clear logs
- Panggil `seedStore()` ulang

## Catatan

Store **in-memory**. Restart server = data custom hilang (seed data kembali).
