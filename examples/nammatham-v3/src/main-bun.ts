// PoC version for combining between v2 and v3 proposal
import { Nammatham } from 'nammatham';
import { Hono } from 'hono';

const dev = process.env.NODE_ENV === 'development';
const port = 3002;
const nammatham = new Nammatham({ dev, port });
const func = nammatham.createFunction();

const app = new Hono();

app.get('/', c => {
  return c.text('Hello, World! eee');
});

nammatham.addFunction(
  func.timer('myTimer', { schedule: '0 */5 * * * *' }).handler(async c => {
    if (c.trigger.isPastDue) {
      console.log('Past due');
    }
  })
);

export default nammatham.handle(app);
