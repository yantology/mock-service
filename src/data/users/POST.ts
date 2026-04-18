export const data = {
  status: 201,
  body: {
    id: 'user-123',
    name: 'John Doe',
    avatar: 'https://cdn.example.com/avatars/user-123.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
};

export const meta = {
  description: 'Create user with avatar upload',
};

export const requests = {
  json: {
    summary: 'JSON input (no file)',
    contentType: 'application/json',
    value: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  form: {
    summary: 'Form input',
    contentType: 'application/x-www-form-urlencoded',
    value: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  multipart: {
    summary: 'Upload with avatar',
    contentType: 'multipart/form-data',
    value: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'binary',  // Ini jadi file picker di Swagger UI
    },
  },
};

export default data;
