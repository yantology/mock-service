# Scenario Switching

## 1. Header-based (Recommended)

Tambahkan header `X-Mock-Scenario` ke request:

```bash
curl -H "X-Mock-Scenario: error" http://localhost:8787/api/hello
```

Response menggunakan handler `scenarios.error` alih-alih default `data`.

## 2. Global Scenario

```bash
POST /api/__scenarios
Content-Type: application/json

{
  "route": "hello",
  "scenario": "error"
}
```

Set default scenario untuk route ketika tidak ada header.

## Definisi Scenarios

```ts
export const data = {
  status: 200,
  body: { message: 'Hello' },
};

export const scenarios = {
  error: {
    status: 500,
    body: { error: 'Simulated failure' },
    description: 'Simulate internal server error',
  },
  empty: {
    status: 200,
    body: { message: 'Hello', items: [] },
    description: 'Return hello with empty items',
  },
};
```

Bisa juga pakai function:

```ts
export const scenarios = {
  error: () => ({
    status: 500,
    body: { error: 'Oops' },
  }),
};
```

## Registry

```bash
GET /api/__registry           # Semua route & scenarios
GET /api/__registry/hello     # Spesifik route
```

## Management

```bash
DELETE /api/__scenarios       # Clear semua scenario
POST /api/__reset             # Reset total (store + scenario + logs)
```
