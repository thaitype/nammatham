import {
  app,
  input,
  InvocationContext,
  output,
  HttpRequest,
  StorageBlobInputOptions,
  StorageBlobOptions,
  StorageQueueTriggerOptions,
} from '@azure/functions';

// Ref: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns

// const blobInput = input.storageBlob({
//   name: 'MyBlobInput',
//   // Error: name does not exist in type `StorageBlobInputOptions`.
//   // But we still can use name and call it later in the handler.
//   connection: 'AzureWebJobsStorage',
//   path: 'demo-input/xxx.txt',
// } as StorageBlobInputOptions & { name: string });

// const blobOutput = output.storageBlob({
//   name: 'MyBlobOutput',
//   // Error: name does not exist in type `StorageBlobInputOptions`.
//   // But we still can use name and call it later in the handler.
//   connection: 'AzureWebJobsStorage',
//   path: 'demo-output/xxx-{rand-guid}.txt',
// } as StorageBlobOptions & { name: string });

// app.get('copyBlob', {
//   authLevel: 'anonymous',
//   extraInputs: [blobInput],
//   extraOutputs: [blobOutput],
//   handler: (queueItem: HttpRequest, context: InvocationContext) => {
//     context.log('Storage queue function processed work item:', queueItem);

//     const blobInputValue = context.extraInputs.get('MyBlobInput');
//     context.extraOutputs.set('MyBlobOutput', blobInputValue);
//     return {
//       body: `Hello, ${blobInputValue}!`,
//     };
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

// import { InvocationContext, StorageQueueTriggerOptions } from '@azure/functions';
// import { httpGet } from '../../../../packages/core/src/design-shorthand';

const initNammatham = {
  create() {
    return new NammathamTrigger();
  },
};

class NammathamContext<T> extends InvocationContext {
  // constructor(public invocationContext: InvocationContext) {}
  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  // public log(...args: any[]) {
  //   this.invocationContext.log(...args);
  // }
  outputs = {
    blobOutput: {
      set: (value: unknown) => {
        throw new Error('Not implemented');
      },
    },
  };
  inputs = {
    blobInput: {
      get: () => {
        throw new Error('Not implemented');
      },
    },
  };
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

class NammathamFunction<T> {
  addInput(name: string, option: any) {
    return this;
  }

  addOutput(name: string, option: any) {
    return this;
  }

  handler(func: (queueItem: unknown, context: NammathamContext<T>) => void) {
    throw new Error('Function not implemented.');
  }
}

class NammathamTrigger {
  constructor(public name?: string) {}

  generic() {
    return new NammathamFunction();
  }

  httpGet(funcName: string, option: any) {
    return new NammathamFunction();
  }

  httpDelete() {
    return new NammathamFunction();
  }

  storageQueue(funcName: string, option: StorageQueueTriggerOptions) {
    return new NammathamFunction();
  }
}

const copyBlobFunction = initNammatham
  .create()
  .httpGet('CopyBlob', {
    queueName: 'copyblobqueue',
    connection: 'storage_APPSETTING',
  })
  .addInput('blobInput', {
    type: 'storageBlob',
    connection: 'storage_APPSETTING',
    path: 'helloworld/{queueTrigger}-copy',
  })
  .addOutput('blobOutput', {
    connection: 'storage_APPSETTING',
    path: 'helloworld/{queueTrigger}-copy',
  });

copyBlobFunction.handler((queueItem: unknown, context: NammathamContext<typeof copyBlobFunction>) => {
  // const { invocationContext } = context;
  context.log('Storage queue function processed work item:', queueItem);
  const blobInputValue = context.inputs.blobInput.get();

  context.outputs.blobOutput.set(blobInputValue);
});
