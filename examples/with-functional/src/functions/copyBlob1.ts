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
  HttpResponseInit,
  HttpHandler,
  HttpResponse,
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

export function getExtraInputGetterFunc<TReturn = unknown>(context: InvocationContext, name: string) {
  return { get: () => context.extraInputs.get(name) as TReturn };
}

export function getExtraOutputSetterFunc<TValue = unknown>(context: InvocationContext, name: string) {
  return { set: (value: TValue) => context.extraOutputs.set(name, value) };
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
    blobOutput: getExtraOutputSetterFunc(this.invocationContext, 'blobOutput'),
  };
  inputs = {
    blobInput: getExtraInputGetterFunc(this.invocationContext, 'blobInput'),
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

export type PromiseLike<T> = T | Promise<T>;

export type HandlerFunction<TTriggerType = unknown, TReturnType = any, TType = unknown> = (
  triggerInput: TTriggerType,
  context: NammathamContext<TType>
) => PromiseLike<TReturnType>;

export type FunctionAppOption<TTriggerOption = unknown> = {
  trigger: TTriggerOption;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
};

export type InputOption = StorageBlobInputOptions | Record<string, unknown>;
export type OutputOption = StorageBlobOutputOptions | Record<string, unknown>;

export type GeneralHandler = (triggerInput: any, context: InvocationContext) => PromiseLike<any>;
export type InvokeFunctionOption = (option: {
  handler: GeneralHandler;
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}) => void;

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
    this.inputs[name] = option as any;
    return this;
  }

  addOutput<TName extends string, TOption extends OutputOption>(name: TName, option: TOption) {
    this.outputs[name] = option as any;
    return this;
  }

  private toList(data: Record<string, unknown>): Record<string, unknown>[] {
    return Object.entries(data).map(([name, option]) => {
      return {
        ...(option as any),
        // override name with predefined name from `addBindingName` in `@azure/functions`
        name,
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

class NammathamFunction<TTriggerType, TReturnType> extends NammathamBinding {
  constructor(public funcName: string, public invokeFunc: InvokeFunctionOption) {
    super();
  }
  handler(func: HandlerFunction<TTriggerType, TReturnType, any>) {
    this.invokeFunc({
      handler: (triggerInput: TTriggerType, context: InvocationContext) => {
        const nammathamContext = new NammathamContext(context);
        return func(triggerInput, nammathamContext);
      },
      extraInputs: this.toInputList(),
      extraOutputs: this.toOutputList(),
    });
  }
}

class NammthamBindingHelper {
  input = {
    storageBlob(option: StorageBlobInputOptions) {
      return input.storageBlob(option);
    },
    generic(option: GenericInputOptions) {
      return input.generic(option);
    },
  };

  output = {
    storageBlob(option: StorageBlobOutputOptions) {
      return output.storageBlob(option);
    },
    generic(option: GenericOutputOptions) {
      return output.generic(option);
    },
  };
}

class NammathamTrigger extends NammthamBindingHelper {
  generic(funcName: string, option: any) {
    return new NammathamFunction<unknown, unknown | void>(funcName, option);
  }

  httpGet(funcName: string, option: HttpTriggerOptions) {
    return new NammathamFunction<HttpRequest, HttpResponseInit | HttpResponse>(funcName, funcOption => {
      app.get(funcName, {
        ...option,
        ...funcOption,
      });
    });
  }

  httpDelete(funcName: string, option: any) {
    return new NammathamFunction<HttpRequest, HttpResponseInit>(funcName, option);
  }

  storageQueue(funcName: string, option: any) {
    return new NammathamFunction<unknown, unknown>(funcName, option);
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
  });
