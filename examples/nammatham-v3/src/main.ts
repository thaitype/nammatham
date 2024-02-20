// PoC version for combining between v2 and v3 prposal
import { nammatham } from 'nammatham-v3';
import { Hono } from 'hono';

const func = nammatham.create();
const app = new Hono();

app.get('/', c => {
  return c.text('Hello, World!');
});

const helloFunction = func.timer('myTimer', { schedule: '0 */5 * * * *' }).handler(async c => {
  if (c.trigger.isPastDue) {
    console.log('Past due');
  }
});

const dev = process.env.NODE_ENV === 'development';

nammatham.handle({
  dev,
  app,
  triggers: {
    helloFunction,
  },
});
