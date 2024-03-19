// PoC version for combining between v2 and v3 proposal
import { Nammatham } from 'nammatham';
import { serve } from '@hono/node-server';
import { Context, Hono, HonoRequest } from 'hono';

const dev = process.env.NODE_ENV === 'development';
const port = 3000;
const nammatham = new Nammatham({ dev, port });
const func = nammatham.createFunction();

const app = new Hono();

app.get('/', c => {
  return c.text('Hello, World!');
});

app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()

  console.log(`Time: ${end - start}ms`)
  // c.res.headers.set('X-Response-Time', `${end - start}`)
})

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

app.routes.forEach(route => {
  console.log(`Route: ${route.path}`);
  route.handler({
    text: (text: string) => console.log(text),
  } as any, async () => console.log('done'));
});