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
// class NammathamFactory {
//   // static create(adapter: Adapter) {
//   //   return new NammathamApp(adapter);
//   // }
//   static createFunc() {
//     return new NammathamFunction();
//   }
// }


import { InvocationContext, StorageQueueTriggerOptions } from '@azure/functions';

const initNammatham = {
  create() {
    return new NammathamFunction();
  }
}

class NammathamContext   {
  constructor(public invocationContext: InvocationContext) {}

  /**
     * The recommended way to log information data (level 2) during invocation.
     * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
     */
  public log(...args: any[]) {
    this.invocationContext.log(...args);
  }
}

export type TriggerType =
  | 'http'
  | 'timer'
  | 'storageBlob'
  | 'storageQueue'
  | 'serviceBusQueue'
  | 'serviceBusTopic'
  | 'eventHub'
  | 'eventGrid'
  | 'cosmosDB';

class NammathamFunction {
  constructor(public name?: string) {}

  trigger(type: TriggerType, option: any) {
    return this;
  }

  storageQueue(funcName: string, option: StorageQueueTriggerOptions) {
    return this;
  }

  addExtraInput(name: string, option: any) {
    return this;
  }

  addExtraOutput(name: string, option: any) {
    return this;
  }

  addExtraInputs(input: any){
    return this;
  }

  handler(func: (queueItem: unknown, context: NammathamContext) => void) {
    throw new Error('Function not implemented.');
  }
}

const app4 = initNammatham.create()
  .storageQueue('CopyBlob', {
    queueName: 'copyblobqueue',
    connection: 'storage_APPSETTING',
  })
  .addExtraInput('blobInput', {
      type: 'storageBlob',
      connection: 'storage_APPSETTING',
      path: 'helloworld/{queueTrigger}-copy',
  })
  .addExtraOutput('storageBlob', {
    connection: 'storage_APPSETTING',
    path: 'helloworld/{queueTrigger}-copy',
  })
  .handler((queueItem: unknown, context: NammathamContext) => {
    context.log('Storage queue function processed work item:', queueItem);
    const blobInputValue = context.extraInputs.get('blobInput');

    context.extraOutputs.set('storageBlob', blobInputValue);
  });

  const app5 = initNammatham.create()