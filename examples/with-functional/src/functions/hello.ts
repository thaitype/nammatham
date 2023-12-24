import { func } from '../nammatham';

export default func
  .httpGet('CopyBlob')
  .handler((request, ctx) => {
    ctx.context.log('HTTP trigger function processed a request.');
    return {
      body: `Hello world!`,
    };
});
