import { initNammatham } from '@nammatham/core';

const route = initNammatham.createRoute();

route
  .get('CopyBlob', {
    route: 'copyblb/koko',
  })
  .handler((request, context) => {
    context.log('HTTP trigger function processed a request.');
    return {
      body: `Hello world!`,
    };
  });

export default route;