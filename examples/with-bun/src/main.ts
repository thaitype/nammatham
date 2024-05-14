import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HonoFunctionTrigger } from 'nammatham';

const app = new Hono()
app.use(logger())

const func = new HonoFunctionTrigger();

app.all('/SimpleHttpTrigger', c => {
  console.log('SimpleHttpTrigger');
  // const userAgent = c.req.header('user-agent');
  // console.log(`user agent is: ${userAgent}`);

  // const invocationId = c.req.header('x-azure-functions-invocationid');
  // console.log(`invocationid is: ${invocationId}`);

  // return c.text('Hello World from bun worker');
  // https://github.com/anthonychu/azure-functions-deno-worker/blob/main/mod.ts
  return c.json({
    Outputs: {
      res: {
        StatusCode: 200,
        Body: 'my world',
        // headers: {
        //   header1: 'header1Val',
        //   header2: 'header2Val',
        // },
      },
      // message: 'test'
    },
    Logs: ['test log1', 'test log2'],
    // ReturnValue: '{"hello":"world"}', 
    // returnValue: {
    //   data: 'Hello, World',
    // },
    // message: 'Hello, World',
  });
});

app.all(
  ...func.http({
    route: '/api/HttpTriggerStringReturnValue',
  }),
  c => {
    const { func } = c.var;
    // For single output binding
    // return c.json({
    //   invocationId: func.invocationId,
    //   method: c.req.method,
    // });

    // For multiple output binding
    // return c.json({
    //   outputs: {
    //     res: {
    //       statusCode: 201,
    //       body: 'my world',
    //       headers: {
    //         header1: 'header1Val',
    //         header2: 'header2Val',
    //       },
    //     },
    //   },
    //   logs: ['test log1', 'test log2'],
    //   // ReturnValue: '{"hello":"world"}',
    //   message: 'Hello, World',
    // });

    // For multiple output binding
    return c.json({
      outputs: {
        res: {
          statusCode: 201,
          body: 'my world',
          headers: {
            header1: 'header1Val',
            header2: 'header2Val',
          },
        },
      },
      logs: ['test log1', 'test log2'],
      // ReturnValue: '{"hello":"world"}',
      // message: 'Hello, World',
    });
  }
);

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
// console.log(`Start server on on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  func,
};
