import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { FunctionTrigger } from 'nammatham';

// DO NOT SET `basePath` for Hono App, Azure Functions will handle it
const app = new Hono();
app.use(logger());

const trigger = new FunctionTrigger();

app.all(
  ...trigger.http({
    route: '/SimpleHttpTrigger',
  }),
  c => {
    // Getting the function context
    const context = c.var.func;

    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(`invocationid is: ${context.invocationId}`);
    context.log(`The third log message.`);

    return context.json({
      hello: 'world',
    });
  }
);

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
console.log(`Start server on on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  func: trigger,
};
