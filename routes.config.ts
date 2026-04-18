// routes.config.ts
// Single source of truth for all API endpoints
// Format: { path: string, methods: string[], children?: Routes }
// Dynamic params use $paramName syntax (maps to {paramName} in filesystem)

export const routes = {
  auth: {
    methods: ['POST'],
    children: {
      login: {
        methods: ['POST'],
      },
      logout: {
        methods: ['POST'],
      },
      session: {
        methods: ['GET'],
      },
    },
  },

  hello: {
    methods: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
    children: {
      $name: {
        methods: ['GET'],
      },
    },
  },

  items: {
    methods: ['GET', 'POST'],
  },

  onboarding: {
    children: {
      complete: {
        methods: ['POST'],
      },
      status: {
        methods: ['GET'],
      },
    },
  },

  orders: {
    children: {
      $orderId: {
        methods: ['DELETE', 'GET', 'PUT'],
        children: {
          items: {
            methods: ['GET', 'POST'],
          },
        },
      },
    },
  },

  testmulti: {
    methods: ['DELETE', 'GET', 'POST'],
  },

  users: {
    methods: ['GET', 'POST'],
  },
};

export default routes;
