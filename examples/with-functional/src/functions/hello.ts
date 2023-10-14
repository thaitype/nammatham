import { initNammatham } from '@nammatham/core';

const app = initNammatham.create();

app
  .get('CopyBlob')
  .handler((request, context) => {
    context.log('HTTP trigger function processed a request.');
    return {
      body: `Hello world!`,
    };
  });
