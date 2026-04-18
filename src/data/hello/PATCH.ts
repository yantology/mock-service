export const data = {
  status: 200,
  body: {
    id: 'hello-123',
    message: 'Partially updated',
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
  description: 'Partial update of a hello message',
};

export const requests = {
  partial: {
    summary: 'Partial update',
    value: {
      message: 'Just updating the message',
    },
  },
};

export default data;
