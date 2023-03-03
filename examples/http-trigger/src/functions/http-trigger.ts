import { app, HttpRequest, InvocationContext } from '@azure/functions';

app.http('httpTrigger1', {
  methods: ['POST', 'GET'],
  handler: async (request: HttpRequest, context: InvocationContext) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || (await request.text()) || 'world';

    return { body: `Hello test xx, ${name}!` };
  },
});
