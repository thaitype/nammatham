import { func } from '../nammatham';

export default func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler((request, ctx) => {
    ctx.context.log('HTTP trigger function processed a request.');
    return {
      body: `Hello world!`,
    };
});
