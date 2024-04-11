import { input } from '@azure/functions';
import { func } from '../nammatham';

const blobInput = input.storageBlob({
  connection: 'AzureWebJobsStorage',
  path: 'demo-input/xxx.txt',
});

const blobOutput = input.storageBlob({
  connection: 'AzureWebJobsStorage',
  path: 'demo-output/xxx-{rand-guid}.txt',
});

export default func
  .httpGet('CopyBlob', {
    authLevel: 'anonymous',
    extraInputs: [blobInput],
    extraOutputs: [blobOutput],
  })
  .handler(c => {
    c.context.log('function processed work item:', c.trigger);
    const blobInputValue = c.context.extraInputs.get(blobOutput);

    c.context.extraOutputs.set(blobOutput, blobInputValue);
    return c.text(`Hello ${blobInputValue}`);
  });
