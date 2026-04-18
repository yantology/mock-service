export const mockConfig = {
  basePath: '/api',
  docsPath: '/docs',
  openApiPath: '/openapi.json',
  groups: {
    default: ['hello/*'],
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      description: 'Bearer token JWT',
    },
  },
  security: ['BearerAuth'],
  globalHeaders: [
    { name: 'X-Request-ID', description: 'Unique request identifier', required: false },
  ],
  info: {
    title: 'My Mock API',
    version: '1.0.0',
    description: 'Mock API service built with create-mock-service',
  },
  servers: [
    { url: 'http://localhost:8787', description: 'Local development' },
  ],
};

export default mockConfig;
