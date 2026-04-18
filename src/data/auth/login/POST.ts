export const data = {
  status: 201,
  body: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: 'user-123',
      email: 'john@example.com',
    },
  },
};

export const meta = {
  description: 'User login - No auth required',
  security: false,
  request: {
    email: 'john@example.com',
    password: 'secret123',
  },
};

export default data;
