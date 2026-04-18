export interface MockContext {
  userId: string | null;
  body: Record<string, unknown> | null;
  params: Record<string, string>;
  pathParams: Record<string, string>;
  headers: Record<string, string>;
  store: MockStore;
  scenario: string;
}

export interface MockStore {
  get<T = unknown>(key: string): T | undefined;
  set<T = unknown>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
  snapshot(): Record<string, unknown>;
}

export type MockHandlerResult = unknown | { status: number; body: unknown; description?: string } | Response;

export type MockHandler =
  | ((ctx: MockContext) => MockHandlerResult | Promise<MockHandlerResult>)
  | MockHandlerResult;

export interface RequestExample {
  summary?: string;
  description?: string;
  contentType?: string;  // default: application/json
  value: Record<string, unknown>;
}

export interface SecurityScheme {
  type: 'http' | 'apiKey' | 'oauth2' | 'openIdConnect';
  scheme?: string;
  name?: string;
  in?: string;
  description?: string;
  // For oauth2/openIdConnect could add flows, but kept simple here
}

export interface RouteMeta {
  description?: string;
  request?: Record<string, unknown>;
  headers?: Array<{ name: string; description?: string; required?: boolean }>;
  security?: string[] | false;
}

export interface RouteModule {
  data: MockHandler;
  scenarios?: Record<string, MockHandler>;
  meta?: RouteMeta;
}

export interface RouteManifest {
  [routePath: string]: {
    [method: string]: RouteModule;
  };
}

export interface ScenarioRegistry {
  [routePath: string]: {
    [method: string]: string[];
  };
}

export interface MockConfig {
  basePath: string;
  docsPath: string;
  openApiPath: string;
  groups: Record<string, string[]>;
  securitySchemes?: Record<string, SecurityScheme>;
  security?: string[];
  globalHeaders?: Array<{ name: string; description?: string; required?: boolean }>;
  info: {
    title: string;
    version: string;
    description: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
    termsOfService?: string;
  };
  externalDocs?: {
    description: string;
    url: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
}
