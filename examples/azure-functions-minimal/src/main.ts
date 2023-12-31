import { AzureFunctionsAdapter } from "@nammatham/azure-functions";
import { initNammatham } from "@nammatham/core";
import { expressServer } from "@nammatham/express";

const n = initNammatham.create(new AzureFunctionsAdapter());
const func = n.func;
const app = n.app;

const helloFunction = func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(async (request, ctx) => {
    ctx.context.log('HTTP trigger function processed a request.');
    ctx.context.debug(`Http function processed request for url "${request.url}"`);
    const name = request.query.get('name') || (await request.text()) || 'world';
    return { body: `Hello, ${name}!` };
  });

app.addFunctions(helloFunction);
app.use(expressServer());
app.start();
