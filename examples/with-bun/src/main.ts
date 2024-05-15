import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { initNammatham, register } from 'nammatham';

// DO NOT SET `basePath` for Hono App, Azure Functions will handle it
const app = new Hono();
app.use(logger());

const func = initNammatham();

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


export default register({
  fetch: app.fetch,
  func,
});
