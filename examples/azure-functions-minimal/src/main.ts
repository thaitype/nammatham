import { initNammatham, expressPlugin } from 'nammatham';

const n = initNammatham.create();
const func = n.func;
const app = n.app;

app.addFunctions(
  func
    .httpGet('hello', {
      route: 'hello-world',
    })
    .handler(async c => {
      c.context.log('HTTP trigger function processed a request.');
      c.context.debug(`Http function processed request for url "${c.trigger.url}"`);
      const name = c.trigger.query.get('name') || (await c.trigger.text()) || 'world';
      return c.text(`Hello, ${name}!`);
    })
);

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
