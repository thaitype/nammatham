// import { app, input, InvocationContext, output, StorageQueueTriggerOptions } from '@azure/functions';


// const blobInput = input.storageBlob({
//   connection: 'storage_APPSETTING',
//   path: 'helloworld/{queueTrigger}',
// });

// const blobOutput = output.storageBlob({
//   connection: 'storage_APPSETTING',
//   path: 'helloworld/{queueTrigger}-copy',
// });

// app.storageQueue('copyBlob1', {
//   queueName: 'copyblobqueue',
//   connection: 'storage_APPSETTING',
//   extraInputs: [blobInput],
//   extraOutputs: [blobOutput],
//   handler: (queueItem: unknown, context: InvocationContext) => {
//     context.log('Storage queue function processed work item:', queueItem);

//     const blobInputValue = context.extraInputs.get(blobInput);
//     context.extraOutputs.set(blobOutput, blobInputValue);
//   },
// });

import { InvocationContext, StorageQueueTriggerOptions } from "@azure/functions";


class NammathamApp {
  constructor(public name?: string) {}

  trigger(
    type:
      | 'http'
      | 'timer'
      | 'storageBlob'
      | 'storageQueue'
      | 'serviceBusQueue'
      | 'serviceBusTopic'
      | 'eventHub'
      | 'eventGrid'
      | 'cosmosDB',
    option: any
  ) {
    return this;
  }

  storageQueue(name: string, option: StorageQueueTriggerOptions) {
    return this;
  }

  addExtraInput(name: string, option: any) {
    return this;
  }

  addExtraOutput(name: string, option: any) {
    return this;
  }

  handler(func: (queueItem: unknown, context: InvocationContext) => void) {
    throw new Error('Function not implemented.');
  }
}

const app4 = new NammathamApp('CopyBlob')
  .trigger('storageQueue', {
    queueName: 'copyblobqueue',
    connection: 'storage_APPSETTING',
  })
  .addExtraInput('storageBlob', {
    connection: 'storage_APPSETTING',
    path: 'helloworld/{queueTrigger}',
  })
  .addExtraOutput('storageBlob', {
    connection: 'storage_APPSETTING',
    path: 'helloworld/{queueTrigger}-copy',
  })
  .handler((queueItem: unknown, context: InvocationContext) => {
    context.log('Storage queue function processed work item:', queueItem);

    const blobInputValue = context.extraInputs.get('storageBlob'); 
    
    context.extraOutputs.set('storageBlob', blobInputValue);
  },);

// const app3 = new NammathamApp()
//   .storageQueue('storageQueue', {
//     queueName: 'copyblobqueue',
//     connection: 'storage_APPSETTING',
//   })
//   .addExtraInput()
//   .addExtraOutput()
//   .handler();
