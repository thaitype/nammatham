import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { Nammatham } from 'nammatham';

// DO NOT SET `basePath` for Hono App, Azure Functions will handle it
const honoApp = new Hono();
honoApp.use(logger());

const app = new Nammatham();

// Inspired by https://hono.dev/getting-started/azure-functions
app.http({
  methods: [
    "GET",
    "POST",
    "DELETE",
    "PUT"
  ],
  authLevel: "anonymous",
  route: "{*proxy}",
  handler: app.handle(honoApp.fetch)
});

honoApp.all(
  ...app.http({
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
  fetch: honoApp.fetch,
  func: app,
};
