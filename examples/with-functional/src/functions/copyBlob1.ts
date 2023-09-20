import {
  app,
  input,
  InvocationContext,
  output,
  HttpRequest,
  StorageBlobInputOptions,
  StorageBlobOptions,
} from '@azure/functions';

// Ref: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns

const blobInput = input.storageBlob({
  name: 'MyBlobInput',
  // Error: name does not exist in type `StorageBlobInputOptions`.
  // But we still can use name and call it later in the handler.
  connection: 'AzureWebJobsStorage',
  path: 'demo-input/xxx.txt',
} as StorageBlobInputOptions & { name: string });

const blobOutput = output.storageBlob({
  name: 'MyBlobOutput',
  // Error: name does not exist in type `StorageBlobInputOptions`.
  // But we still can use name and call it later in the handler.
  connection: 'AzureWebJobsStorage',
  path: 'demo-output/xxx-{rand-guid}.txt',
} as StorageBlobOptions & { name: string });

app.get('copyBlob', {
  authLevel: 'anonymous',
  extraInputs: [blobInput],
  extraOutputs: [blobOutput],
  handler: (queueItem: HttpRequest, context: InvocationContext) => {
    context.log('Storage queue function processed work item:', queueItem);

    const blobInputValue = context.extraInputs.get('MyBlobInput');
    context.extraOutputs.set('MyBlobOutput', blobInputValue);
    return {
      body: `Hello, ${blobInputValue}!`,
    };
  },
});


// class NammathamFactory {
//   // static create(adapter: Adapter) {
//   //   return new NammathamApp(adapter);
//   // }
//   static createFunc() {
//     return new NammathamFunction();
//   }
// }

// import { InvocationContext, StorageQueueTriggerOptions } from '@azure/functions';
// import { httpGet } from '../../../../packages/core/src/design-shorthand';

// const initNammatham = {
//   create() {
//     return new NammathamFunction();
//   }
// }

// class NammathamContext   {
//   constructor(public invocationContext: InvocationContext) {}

//   /**
//      * The recommended way to log information data (level 2) during invocation.
//      * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
//      */
//   public log(...args: any[]) {
//     this.invocationContext.log(...args);
//   }
// }

// export type TriggerType =
//   | 'http'
//   | 'timer'
//   | 'storageBlob'
//   | 'storageQueue'
//   | 'serviceBusQueue'
//   | 'serviceBusTopic'
//   | 'eventHub'
//   | 'eventGrid'
//   | 'cosmosDB';

// class NammathamFunction {
//   constructor(public name?: string) {}

//   trigger(type: TriggerType, option: any) {
//     return this;
//   }

//   storageQueue(funcName: string, option: StorageQueueTriggerOptions) {
//     return this;
//   }

//   addExtraInput(name: string, option: any) {
//     return this;
//   }

//   addExtraOutput(name: string, option: any) {
//     return this;
//   }

//   addExtraInputs(input: any){
//     return this;
//   }

//   handler(func: (queueItem: unknown, context: NammathamContext) => void) {
//     throw new Error('Function not implemented.');
//   }
// }

// const app4 = initNammatham.create()
//   .storageQueue('CopyBlob', {
//     queueName: 'copyblobqueue',
//     connection: 'storage_APPSETTING',
//   })
//   .addExtraInput('blobInput', {
//       type: 'storageBlob',
//       connection: 'storage_APPSETTING',
//       path: 'helloworld/{queueTrigger}-copy',
//   })
//   .addExtraOutput('storageBlob', {
//     connection: 'storage_APPSETTING',
//     path: 'helloworld/{queueTrigger}-copy',
//   })
//   .handler((queueItem: unknown, context: NammathamContext) => {
//     context.log('Storage queue function processed work item:', queueItem);
//     const blobInputValue = context.extraInputs.get('blobInput');

//     context.extraOutputs.set('storageBlob', blobInputValue);
//   });

//   const app5 = initNammatham.create()
