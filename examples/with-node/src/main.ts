import { Hono } from 'hono';
import { HonoAzureMiddleware, register } from 'nammatham';
import { serve } from '@hono/node-server';

// DO NOT SET `basePath` for Hono App, Azure Functions will handle it
const app = new Hono();

const func = new HonoAzureMiddleware();

app.all(...func.get('/SimpleHttpTrigger'), c => {
  // Getting the function context
  const context = c.var.context;

  context.log('JavaScript HTTP trigger function processed a request.');
  context.log(`invocationid is: ${context.invocationId}`);
  context.log(`The third log message.`);

  return context.json({
    hello: 'world',
  });
});

const nammathamApp = register({
  fetch: app.fetch,
  func,
});
export default serve(nammathamApp);


