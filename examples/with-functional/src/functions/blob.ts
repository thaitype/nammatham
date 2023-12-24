import { input } from '@azure/functions';
import { initNammatham } from 'nammatham';

const blobInput = input.storageBlob({
  connection: 'AzureWebJobsStorage',
  path: 'demo-input/xxx.txt',
});

const blobOutput = input.storageBlob({
  connection: 'AzureWebJobsStorage',
  path: 'demo-output/xxx-{rand-guid}.txt',
});

const nammatham = initNammatham.create();

export default nammatham
  .httpGet('CopyBlob', {
    authLevel: 'anonymous',
    extraInputs: [blobInput],
    extraOutputs: [blobOutput],
  })
  .handler((request, ctx) => {
    ctx.log('function processed work item:', request);
    const blobInputValue = ctx.context.extraInputs.get(blobOutput);

    ctx.context.extraOutputs.set(blobOutput, blobInputValue);
    return {
      body: `Hello ${blobInputValue}`,
    };
  });
