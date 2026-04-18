export const data = {
  status: 201,
  body: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Alpha',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
};

export const scenarios = {
  validation_error: {
    status: 400,
    body: { error: 'Name is required' },
    description: 'Simulate validation error when name is missing',
  },
};

export const meta = {
  description: 'Create a new item',
};

export const requests = {
  valid: {
    summary: 'Valid input',
    description: 'Complete item data',
    value: {
      name: 'Alpha',
      price: 100000,
      category: 'electronics',
    },
  },
  invalid_empty_name: {
    summary: 'Missing name',
    description: 'Validation error - name is required',
    value: {
      name: '',
      price: 100000,
    },
  },
  missing_fields: {
    summary: 'Missing required fields',
    description: 'Only price provided',
    value: {
      price: 100000,
    },
  },
};

export default data;
