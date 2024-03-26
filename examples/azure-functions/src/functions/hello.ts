import { func } from '../nammatham';

export default func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(async ({ trigger, context }) => {
    context.log('HTTP trigger function processed a request.');
    context.debug(`Http function processed request for url "${trigger.url}"`);
    const name = trigger.query.get('name') || (await trigger.text()) || 'world';
    if (name === 'error') {
      throw new Error('this is an error');
    }
    const result = {
      data: {
        name: name,
        message: `Hello, ${name}!`
      }
    }
    return {
      status: 200,
      jsonBody: result,
    }
  });
