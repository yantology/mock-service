export const data = {
  status: 201,
  body: { message: 'Hello created!' },
};

export const meta = {
  description: 'Create a hello message',
};

export const requests = {
  valid: {
    summary: 'Valid input',
    value: {
      name: 'John Doe',
      message: 'Hello World',
    },
  },
};

export default data;
