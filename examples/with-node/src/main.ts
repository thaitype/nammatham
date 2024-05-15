import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { HonoAzureMiddleware, register } from 'nammatham';
import { logger } from 'hono/logger';

// DO NOT SET `basePath` for Hono App, Azure Functions will handle it
const app = new Hono();
app.use(logger());

const func = new HonoAzureMiddleware();

app.all(
  ...func.http({
    route: '/SimpleHttpTrigger',
  }),
  c => {
    // Getting the function context
    const context = c.var.context;

    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(`invocationid is: ${context.invocationId}`);
    context.log(`The third log message.`);

    return context.json({
      hello: 'world',
    });
  }
);

export default serve(
  register({
    fetch: app.fetch,
    func,
  })
);


