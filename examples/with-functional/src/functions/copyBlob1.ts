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
  HttpTriggerOptions,
  GenericFunctionOptions,
  FunctionInput,
  FunctionOutput,
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

export function getExtraInputSetterFunc<TReturn = unknown>(context: InvocationContext, name: string) {
  return { get: () => context.extraOutputs.get(name) as TReturn };
}

export function getExtraOutputGetterFunc<TValue = unknown>(context: InvocationContext, name: string) {
  return { set: (value: TValue) => context.extraInputs.set(name, value) };
}

class NammathamContext<T> {
  constructor(public invocationContext: InvocationContext) {}
  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  public log(...args: any[]) {
    this.invocationContext.log(...args);
  }

  outputs = {
    blobOutput: getExtraOutputGetterFunc(this.invocationContext, 'blobOutput'),
  };
  inputs = {
    blobInput: getExtraInputSetterFunc(this.invocationContext, 'blobInput'),
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

  private toList(data: Record<string, unknown>): Record<string, unknown>[] {
    return Object.entries(data).map(([name, option]) => {
      return {
        name,
        ...(option as any),
      };
    });
  }

  protected toInputList() {
    return this.toList(this.inputs) as FunctionInput[];
  }

  protected toOutputList() {
    return this.toList(this.outputs) as FunctionOutput[];
  }
}

class NammathamFunction<TTriggerType> extends NammathamBinding {
  constructor(public funcName: string, public option: Omit<GenericFunctionOptions, 'handler'>) {
    super();
  }
  handler(func: HandlerFunction<TTriggerType, any>) {
    app.generic(this.funcName, {
      ...this.option,
      extraInputs: this.toInputList(),
      extraOutputs: this.toOutputList(),
      handler: (triggerInput: TTriggerType, context: InvocationContext) => {
        func(triggerInput, new NammathamContext(context));
      },
    });
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
    return new NammathamFunction<unknown>(funcName, option);
  }

  httpGet(funcName: string, option: HttpTriggerOptions) {
    return new NammathamFunction<HttpRequest>(funcName, {
      ...option,
      trigger: {
        name: funcName,
        type: 'http',
      },
    });
  }

  httpDelete(funcName: string, option: any) {
    return new NammathamFunction<HttpRequest>(funcName, option);
  }

  storageQueue(funcName: string, option: any) {
    return new NammathamFunction<unknown>(funcName, option);
  }
}

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
      path: 'demo-input/xxx-{rand-guid}.txt',
    })
  )
  .handler((request, context) => {
    // const { invocationContext } = context;
    context.log('Storage queue function processed work item:', request);
    const blobInputValue = context.inputs.blobInput.get();

    context.outputs.blobOutput.set(blobInputValue);
  });
