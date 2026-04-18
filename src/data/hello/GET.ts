export const data = {
  status: 200,
  body: {
    messages: [
      { id: '1', message: 'Hello World' },
      { id: '2', message: 'Hi there' },
    ],
    total: 2,
  },
};

export const scenarios = {
  empty: {
    status: 200,
    body: { messages: [], total: 0 },
    description: 'No messages found',
  },
};

export const meta = {
  description: 'Get all hello messages',
};

export default data;
