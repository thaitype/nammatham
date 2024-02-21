// PoC version for combining between v2 and v3 proposal
import { Nammatham } from 'nammatham';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const dev = process.env.NODE_ENV === 'development';
const port = 3000;
const nammatham = new Nammatham({ dev, port });
const func = nammatham.createFunction();

const app = new Hono();

app.get('/', c => {
  return c.text('Hello, World!');
});

nammatham.addFunction(
  func.timer('myTimer', { schedule: '0 */5 * * * *' }).handler(async c => {
    if (c.trigger.isPastDue) {
      console.log('Past due');
    }
  })
);

// parsing serve function for node.js runtime on dev
nammatham.useNodeServer(serve);

// For Node.js
nammatham.handle(app);
