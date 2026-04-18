export const routes = {
  hello: {
    methods: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
    children: {
      $name: {
        methods: ['GET'],
      },
    },
  },
};

export default routes;
