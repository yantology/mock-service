# Filosofi Mock Service

## Mock ini bukan Backend

Mock service ini **bukan** pengganti backend. Ia adalah:

1. **API Contract** — bentuk request/response yang disepakati FE dan BE
2. **FE Development Accelerator** — FE bisa dikerjakan paralel dengan BE
3. **Testing Tool** — simulasi error, delay, dan edge cases

## Jangan Letakkan Auth Middleware di Mock

Mock service tidak boleh meng-enforce JWT, session, atau auth flow. Mengapa?

- **Backend** mungkin pakai OAuth, API Gateway, atau custom auth yang berbeda
- **Frontend** jadi terbiasa dengan behavior mock yang tidak realistis
- **Contract** jadi berantakan — FE berharap 401 di middleware, tapi BE mengirim 403 dari service layer

### Apa yang boleh dilakukan?

- Decode JWT token untuk ambil `userId` lalu return mock data user yang berbeda
- Return error 401/403/500 **dari dalam handler** sebagai simulasi scenario
- Jangan pernah blok request di middleware level

## REST-ful Responses

Mock service ini menggunakan **REST conventions** dengan status code HTTP yang eksplisit:

```ts
export const data = {
  status: 200,
  body: { message: 'Hello' },
};
```

Atau untuk error:

```ts
export const data = {
  status: 404,
  body: { error: 'Not found' },
};
```

Status code ditentukan **manual oleh handler**, bukan di-enforce oleh framework.
