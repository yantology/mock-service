export const data = {
  status: 200,
  body: [
    { id: '1', name: 'Alpha' },
    { id: '2', name: 'Beta' },
  ],
};

export const scenarios = {
  error: {
    status: 500,
    body: { error: 'Failed to fetch items' },
    description: 'Simulate server error',
  },
  empty: {
    status: 200,
    body: [],
    description: 'Return empty array',
  },
  slow: {
    status: 200,
    body: [{ id: '1', name: 'Alpha' }],
    description: 'Return minimal data (combine with X-Mock-Delay header)',
  },
};

export const meta = {
  description: 'Get all items from store',
};

export default data;
