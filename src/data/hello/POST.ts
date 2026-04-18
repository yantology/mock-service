export const data = {
  status: 201,
  body: {
    id: 'hello-123',
    message: 'Hello World',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
};

export const scenarios = {
  validation_error: {
    status: 400,
    body: { error: 'Message is required' },
    description: 'Simulate validation error',
  },
  server_error: {
    status: 500,
    body: { error: 'Internal server error' },
    description: 'Simulate server error',
  },
};

export const meta = {
  description: 'Create a new hello message',
};

export const requests = {
  json_full: {
    summary: 'JSON - Full nested data',
    description: 'JSON format with nested object and array',
    contentType: 'application/json',
    value: {
      name: 'John Doe',
      message: 'Hello World',
      metadata: {
        source: 'web',
        version: '2.0',
      },
      tags: ['greeting', 'test', 'production'],
    },
  },
  json_minimal: {
    summary: 'JSON - Minimal',
    description: 'Only required field',
    contentType: 'application/json',
    value: {
      message: 'Hi there!',
    },
  },
  form_simple: {
    summary: 'Form - Simple flat data',
    description: 'Form data (flat key-value only, no nesting)',
    contentType: 'application/x-www-form-urlencoded',
    value: {
      name: 'John Doe',
      message: 'Hello from form',
    },
  },
  form_array: {
    summary: 'Form - With array tags',
    description: 'Form data with multiple values (sent as tags[]=greeting&tags[]=test)',
    contentType: 'application/x-www-form-urlencoded',
    value: {
      message: 'Hello',
      tags: 'greeting,test',
    },
  },
  multipart_upload: {
    summary: 'Multipart - With file',
    description: 'Multipart form with image upload',
    contentType: 'multipart/form-data',
    value: {
      name: 'John Doe',
      message: 'Hello with image',
      avatar: 'binary',  // File picker di Swagger UI
    },
  },
  invalid: {
    summary: 'Invalid - Missing required',
    description: 'Missing message field (will fail validation)',
    contentType: 'application/json',
    value: {
      name: 'John',
    },
  },
};

export default data;
