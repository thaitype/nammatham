import {
  app,
  input,
  InvocationContext,
  output,
  HttpRequest,
  StorageBlobInputOptions,
  StorageBlobOptions,
  StorageQueueTriggerOptions,
  StorageBlobOutputOptions,
  GenericOutputOptions,
  GenericInputOptions,
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

// Ref: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns

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

export type HandlerFunction<TTriggerType = unknown, TType = unknown> = (
  triggerInput: TTriggerType,
  context: NammathamContext<TType>
) => any;

export type FunctionAppOption<TTriggerOption = unknown> = {
  trigger: TTriggerOption;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
};

export type InputOption = StorageBlobInputOptions | Record<string, unknown>;
export type OutputOption = StorageBlobOutputOptions | Record<string, unknown>;

class NammathamBinding<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TTrigger extends Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  TInput extends Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  TOutput extends Record<string, unknown> = {}
> {
  funcTrigger = {} as TTrigger;
  inputs = {} as TInput;
  outputs = {} as TOutput;

  addInput<TName extends string, TOption extends InputOption>(name: TName, option: TOption) {
    return this;
  }

  addOutput<TName extends string, TOption extends OutputOption>(name: TName, option: TOption) {
    return this;
  }
}

class NammathamFunction<TTriggerType> extends NammathamBinding {
  handler(func: HandlerFunction<TTriggerType, any>) {
    throw new Error('Function not implemented.');
  }
}

class NammthamBindingHelper {
  input = {
    storageBlob(option: StorageBlobInputOptions) {
      return option;
    },
    cosmosDB(option: GenericInputOptions) {
      return option;
    },
  };

  output = {
    storageBlob(option: StorageBlobOutputOptions) {
      return option;
    },
    generic(option: GenericOutputOptions) {
      return option;
    },
  };
}

class NammathamTrigger extends NammthamBindingHelper {
  generic(funcName: string, option: any) {
    return new NammathamFunction<unknown>();
  }

  httpGet(funcName: string, option: any) {
    return new NammathamFunction<HttpRequest>();
  }

  httpDelete(funcName: string, option: any) {
    return new NammathamFunction<HttpRequest>();
  }

  storageQueue(funcName: string, option: StorageQueueTriggerOptions) {
    return new NammathamFunction<unknown>();
  }
}

const nmt = initNammatham.create();

nmt
  .httpGet('CopyBlob', {
    queueName: 'copyblobqueue',
    connection: 'storage_APPSETTING',
  })
  .addInput(
    'blobInput',
    nmt.input.storageBlob({
      connection: 'storage_APPSETTING',
      path: 'helloworld/{queueTrigger}-copy',
    })
  )
  .addOutput(
    'blobOutput',
    nmt.output.storageBlob({
      connection: 'storage_APPSETTING',
      path: 'helloworld/{queueTrigger}-copy',
    })
  )
  .handler((request, context) => {
    // const { invocationContext } = context;
    context.log('Storage queue function processed work item:', request);
    const blobInputValue = context.inputs.blobInput.get();

    context.outputs.blobOutput.set(blobInputValue);
  });
