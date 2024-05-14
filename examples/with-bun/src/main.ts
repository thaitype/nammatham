import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HonoFunctionTrigger } from 'nammatham';

// DO NOT SET `basePath` for Hono App, Azure Functions will handle it
const app = new Hono();
app.use(logger());

const func = new HonoFunctionTrigger();

app.all(
  ...func.http({
    route: '/SimpleHttpTrigger',
  }),
  c => {
    console.log('SimpleHttpTrigger');
    const userAgent = c.req.header('user-agent');
    console.log(`user agent is: ${userAgent}`);

    const invocationId = c.req.header('x-azure-functions-invocationid');
    console.log(`invocationid is: ${invocationId}`);

    return c.json({
      Outputs: {
        res: {
          StatusCode: 200,
          Body: 'my world',
          headers: {
            header1: 'header1Val',
          },
        },
      },
      Logs: ['test log1', 'test log2'],
      // ReturnValue: '{"hello":"world"}',
    });
  }
);

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
console.log(`Start server on on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  func,
};
