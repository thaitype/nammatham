// PoC version for combining between v2 and v3 prposal
import { nammatham } from 'nammatham-v3';
import { Hono } from 'hono';
// import { serve } from '@hono/node-server'

const func = nammatham.create();
const app = new Hono().basePath("/api")

app.get('/', c => {
  return c.text('Hello, World!');
});

const helloFunction = func.timer('myTimer', { schedule: '0 */5 * * * *' }).handler(async c => {
  if (c.trigger.isPastDue) {
    console.log('Past due');
  }
});

const dev = process.env.NODE_ENV === 'development';

// Bun.js Runtime
export default nammatham.handle({
  dev,
  app,
  triggers: {
    helloFunction,
  },
});

// Node.js Runtime
// serve({
//   fetch: app.fetch,
//   port: 8787,
// })
