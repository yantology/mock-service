export const data = {
  status: 204,
  body: null,
};

export const scenarios = {
  not_found: {
    status: 404,
    body: { error: 'Hello message not found' },
    description: 'Resource not found',
  },
};

export const meta = {
  description: 'Delete a hello message',
};

export default data;
