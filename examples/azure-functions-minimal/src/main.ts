import { AzureFunctionsAdapter, initNammatham, expressPlugin } from 'nammatham';

const n = initNammatham.create(new AzureFunctionsAdapter());
const func = n.func;
const app = n.app;

app.addFunctions(
  func
    .httpGet('hello', {
      route: 'hello-world',
    })
    .handler(async ({ trigger, context }) => {
      context.log('HTTP trigger function processed a request.');
      context.debug(`Http function processed request for url "${trigger.url}"`);
      const name = trigger.query.get('name') || (await trigger.text()) || 'world';
      return { body: `Hello, ${name}!` };
    })
);

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
