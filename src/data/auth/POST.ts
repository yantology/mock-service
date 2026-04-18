export const data = {
  status: 201,
  body: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
};

export const meta = {
  description: 'Register new user - No auth required',
  security: false,
  request: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
  },
};

export default data;
