export const mockConfig = {
  basePath: '/api',
  docsPath: '/docs',
  openApiPath: '/openapi.json',
  groups: {
    default: ['hello/*', 'auth/*'],
    users: ['users/*'],
    orders: ['orders/*'],
    items: ['items/*'],
  },
  securitySchemes: {
    BearerAuth: { type: 'http', scheme: 'bearer', description: 'Bearer token JWT' },
    ApiKeyAuth: { type: 'apiKey', name: 'X-API-Key', in: 'header', description: 'API key from dashboard' },
  },
  security: ['BearerAuth'], // auth default untuk semua route
  globalHeaders: [
    { name: 'X-Request-ID', description: 'Unique request identifier (UUID)', required: false },
    { name: 'X-Client-ID', description: 'Client application identifier', required: false },
  ],
  info: {
    title: 'Mock Service API',
    version: '2.0.0',
    description: 'Modern mock API service with OpenAPI support for Basagram',
    contact: {
      name: 'Basagram Dev Team',
      email: 'dev@basagram.com',
      url: 'https://basagram.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    termsOfService: 'https://basagram.com/terms',
  },
  externalDocs: {
    description: 'Find more info here',
    url: 'https://docs.basagram.com',
  },
  servers: [
    { url: 'http://localhost:8787', description: 'Local development server' },
    { url: 'https://api.basagram.com', description: 'Production server' },
  ],
};

export default mockConfig;
