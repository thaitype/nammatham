import { initNammatham } from '@nammatham/core';

const route = initNammatham.createRoute();

route
  .get('CopyBlob', {
    route: 'copyblb/koko',
    authLevel: 'anonymous',
  })
  .addExtraInput(
    'blobInput',
    route.input.storageBlob({
      connection: 'AzureWebJobsStorage',
      path: 'demo-input/xxx.txt',
    })
  )
  .addExtraOutput(
    'blobOutput',
    route.output.storageBlob({
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

export default route;
