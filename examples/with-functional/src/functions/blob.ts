import { initNammatham } from '@nammatham/core';

const app = initNammatham.create();

app
  .get('CopyBlob', {
    authLevel: 'anonymous',
  })
  .addExtraInput(
    'blobInput',
    app.input.storageBlob({
      connection: 'AzureWebJobsStorage',
      path: 'demo-input/xxx.txt',
    })
  )
  .addExtraOutput(
    'blobOutput',
    app.output.storageBlob({
      connection: 'AzureWebJobsStorage',
      path: 'demo-output/xxx-{rand-guid}.txt',
    })
  )
  .handler((request, context) => {
    context.log('function processed work item:', request);
    const blobInputValue = context.extraInputs.blobInput.get();

    context.extraOutputs.blobOutput.set(blobInputValue);
    return {
      body: `Hello ${blobInputValue}`,
    };
  });
