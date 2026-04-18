export const data = {
  status: 200,
  body: {
    id: 'hello-123',
    message: 'Hello Alice!',
    personalized: true,
  },
};

export const scenarios = {
  not_found: {
    status: 404,
    body: { error: 'Person not found' },
    description: 'Name parameter not found',
  },
};

export const meta = {
  description: 'Get personalized hello message by name',
};

export default data;
