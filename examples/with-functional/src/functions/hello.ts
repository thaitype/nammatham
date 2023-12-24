import { initNammatham } from 'nammatham';

const nammatham = initNammatham.create();

export default nammatham
  .httpGet('CopyBlob')
  .handler((request, context) => {
    context.log('HTTP trigger function processed a request.');
    return {
      body: `Hello world!`,
    };
  });
