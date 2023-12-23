import { initNammatham } from '@nammatham/core';

const nmt = initNammatham.create();

nmt
  .httpGet('CopyBlob', {
    authLevel: 'anonymous',
  })
  .addInput(
    'blobInput',
    nmt.input.storageBlob({
      connection: 'AzureWebJobsStorage',
      path: 'demo-input/xxx.txt',
    })
  )
  .addOutput(
    'blobOutput',
    nmt.output.storageBlob({
      connection: 'AzureWebJobsStorage',
      path: 'demo-output/xxx-{rand-guid}.txt',
    })
  )
  .handler((request, context) => {
    context.log('function processed work item:', request);
    const blobInputValue = context.inputs.blobInput.get();

    context.outputs.blobOutput.set(blobInputValue);
    return {
      body: `Hello ${blobInputValue}`,
    };
  })
  .build();
