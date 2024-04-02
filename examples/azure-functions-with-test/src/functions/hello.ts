import { func } from '../nammatham';

export default func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(async c => {
    c.context.log('HTTP trigger function processed a request.');
    c.context.debug(`Http function processed request for url "${c.trigger.url}"`);
    const name = c.trigger.query.get('name') || (await c.trigger.text()) || 'world';
    if (name === 'error') {
      throw new Error('this is an error');
    }
    return c.json({
      data: {
        name: name,
        message: `Hello, ${name}!`,
      },
    });
  });
