export const data = {
  status: 200,
  body: {
    id: 'hello-123',
    message: 'Updated message',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
};

export const scenarios = {
  not_found: {
    status: 404,
    body: { error: 'Hello message not found' },
    description: 'Resource not found',
  },
};

export const meta = {
  description: 'Full update of a hello message',
};

export const requests = {
  valid: {
    summary: 'Full update',
    value: {
      message: 'Updated hello message',
      name: 'Jane Doe',
      tags: ['updated'],
    },
  },
};

export default data;
