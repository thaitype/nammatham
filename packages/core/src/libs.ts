import {
  app,
  InvocationContext,
  HttpRequest,
  GenericOutputOptions,
  GenericInputOptions,
  HttpTriggerOptions,
  FunctionInput,
  FunctionOutput,
  HttpResponseInit,
  HttpResponse,
} from '@azure/functions';

export const initNammatham = {
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

export type MapTypeToSetterParams<TType> = TType extends 'blob' ? unknown : unknown;

export type ConvertOutput<T extends OutputCollection> = {
  [K in keyof T]: typeof getExtraOutputSetterFunc<MapTypeToSetterParams<T[K]['type']>> extends (
    context: InvocationContext,
    name: string
  ) => infer R
    ? R
    : never;
};

export type ConvertInput<T extends InputCollection> = {
  [K in keyof T]: typeof getExtraInputGetterFunc<MapTypeToSetterParams<T[K]['type']>> extends (
    context: InvocationContext,
    name: string
  ) => infer R
    ? R
    : never;
};

class NammathamContext<TInput extends InputCollection, TOutput extends OutputCollection> {
  constructor(public readonly context: InvocationContext, protected _inputs: TInput, protected _outputs: TOutput) {}
  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  public log(...args: any[]) {
    this.context.log(...args);
  }

  protected getAllOutputsFunc() {
    const result = Object.entries(this._outputs).reduce((acc, [name, value]) => {
      acc[name] = getExtraOutputSetterFunc(this.context, name);
      return acc;
    }, {} as Record<string, unknown>);
    return result as ConvertOutput<TOutput>;
  }

  protected getAllInputsFunc() {
    const result = Object.entries(this._inputs).reduce((acc, [name, value]) => {
      acc[name] = getExtraInputGetterFunc(this.context, name);
      return acc;
    }, {} as Record<string, unknown>);
    return result as ConvertInput<TInput>;
  }

  outputs = this.getAllOutputsFunc();
  inputs = this.getAllInputsFunc();
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

export type HandlerFunction<
  TTriggerType,
  TReturnType,
  TInput extends InputCollection,
  TOutput extends OutputCollection
> = (triggerInput: TTriggerType, context: NammathamContext<TInput, TOutput>) => PromiseLike<TReturnType>;

export type FunctionAppOption<TTriggerOption = unknown> = {
  trigger: TTriggerOption;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
};

/**
 * Function Input & Output
 */

export type FunctionBinding<TType extends string = ''> = {
  type: TType;
} & Record<string, unknown>;

export type AnyHandler = (triggerInput: any, context: InvocationContext) => PromiseLike<any>;
export type InvokeFunctionOption = (option: {
  handler: AnyHandler;
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}) => void;

export type InputCollection = Record<string, FunctionInput>;
export type OutputCollection = Record<string, FunctionOutput>;

export class NammathamFunction<
  TTriggerType,
  TReturnType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TInput extends InputCollection = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  TOutput extends OutputCollection = {}
> {
  protected inputs = {} as TInput;
  protected outputs = {} as TOutput;

  constructor(public funcName: string, public invokeFunc: InvokeFunctionOption) {}

  handler(func: HandlerFunction<TTriggerType, TReturnType, TInput, TOutput>) {
    this.invokeFunc({
      handler: (triggerInput: TTriggerType, context: InvocationContext) => {
        const nammathamContext = new NammathamContext(context, this.inputs, this.outputs);
        return func(triggerInput, nammathamContext);
      },
      extraInputs: this.toInputList(),
      extraOutputs: this.toOutputList(),
    });
  }

  addInput<TName extends string, TType extends string, TOption extends FunctionBinding<TType>>(
    name: TName,
    option: TOption
  ) {
    this.inputs[name] = option as any;
    return this as unknown as NammathamFunction<TTriggerType, TReturnType, TInput & Record<TName, TOption>, TOutput>;
  }

  addOutput<TName extends string, TType extends string, TOption extends FunctionBinding<TType>>(
    name: TName,
    option: TOption
  ) {
    this.outputs[name] = option as any;
    return this as unknown as NammathamFunction<TTriggerType, TReturnType, TInput, TOutput & Record<TName, TOption>>;
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

export type StorageBlobInputOptions = {
  type: 'blob';
  connection: string;
  path: string;
} & Record<string, unknown>;

export type StorageBlobOutputOptions = {
  type: 'blob';
  connection: string;
  path: string;
} & Record<string, unknown>;

export class NammthamBindingHelper {
  public readonly input = {
    storageBlob: (option: Omit<StorageBlobInputOptions, 'type'>) => ({ ...option, type: 'blob' as const }),
    generic: (option: GenericInputOptions) => option,
  };
  public readonly output = {
    storageBlob: (option: Omit<StorageBlobOutputOptions, 'type'>) => ({ ...option, type: 'blob' as const }),
    generic: (option: GenericOutputOptions) => option,
  };
}

export class NammathamTrigger extends NammthamBindingHelper {
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
