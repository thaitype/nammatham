// PoC version for combining between v2 and v3 proposal
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
// import { Nammatham, createHttp } from './lib';

const app = new Hono().basePath('/api');

app.get('/SimpleHttpTrigger', c => {

  const userAgent = c.req.header('user-agent');
  console.log(`user agent is: ${userAgent}`);

  const invocationId = c.req.header('x-azure-functions-invocationid');
  console.log(`invocationid is: ${invocationId}`);

  return c.text('Hello World from go worker');
});

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
console.log(`Start server on on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
})

// app.get(
//   "/copy-blob",
//   ...createHttp({
//     authLevel: "function",
//     inputs: {
//       blobInput: {
//         type: 'blobStorage',
//         connection: 'AzureWebJobsStorage',
//         path: 'demo-input/xxx.txt',
//       },
//     },
//     outputs: {
//       blobOutput: {
//         connection: 'AzureWebJobsStorage',
//         path: 'demo-output/xxx-{rand-guid}.txt',
//       },
//     }
//   }, (c) => {
//     // Access with ExtraInput
//     const blob = c.get("inputs").blobInput;
//     // Access with ExtraOutput
//     c.get('outputs').blobOutput.set(blob);
//     return c.text('success');
//   })
// );

// export default app;
