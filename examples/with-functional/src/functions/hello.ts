import { func } from '../nammatham';

export default func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(async (request, ctx) => {
    ctx.context.log('HTTP trigger function processed a request.');
    ctx.context.debug(`Http function processed request for url "${request.url}"`);
    const name = request.query.get('name') || (await request.text()) || 'world';
    if(name === 'error'){
      throw new Error('this is an error');
    }
    return { body: `Hello, ${name}!` };
  });
