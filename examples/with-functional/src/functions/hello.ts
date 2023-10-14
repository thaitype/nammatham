import { initNammatham } from '@nammatham/core';

const nmt = initNammatham.create();

nmt
  .httpGet('CopyBlob')
  .handler((request, context) => {
    context.log('HTTP trigger function processed a request.');
    return {
      body: `Hello world!`,
    };
  });
