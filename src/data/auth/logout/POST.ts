export const data = {
  status: 201,
  body: { message: 'Logged out successfully' },
};

export const meta = {
  description: 'User logout - No auth required',
  security: false,
  request: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
};

export default data;
