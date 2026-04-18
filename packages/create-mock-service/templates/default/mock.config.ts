export const mockConfig = {
  basePath: '/api',
  docsPath: '/docs',
  openApiPath: '/openapi.json',
  groups: {
    default: ['hello/*'],
  },
  securitySchemes: {
    BearerAuth: { type: 'http', scheme: 'bearer', description: 'Bearer token JWT' },
  },
  security: ['BearerAuth'],
  globalHeaders: [
    { name: 'X-Request-ID', description: 'Unique request identifier (UUID)', required: false },
  ],
  info: {
    title: 'My Mock API',
    version: '1.0.0',
    description: 'Mock API service built with create-mock-service',
    contact: {
      name: 'Dev Team',
      email: 'dev@example.com',
      url: 'https://example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    { url: 'http://localhost:8787', description: 'Local development server' },
  ],
};

export default mockConfig;
