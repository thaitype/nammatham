import { NammathamContext } from './nammatham-context';
import {
  FunctionBinding,
  HandlerFunction,
  InputCollection,
  InvokeFunctionOption,
  NammathamFunctionEndpoint,
  OutputCollection,
  PromiseLike
} from './types';
import { FunctionInput, InvocationContext, FunctionOutput } from '@azure/functions';

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
  protected invokeHandler!: (
    triggerInput: TTriggerType,
    context: InvocationContext
  ) => PromiseLike<TReturnType>;

  constructor(public funcName: string, public invokeFunc: InvokeFunctionOption) {}

  handler(func: HandlerFunction<TTriggerType, TReturnType, TInput, TOutput>) {
    this.invokeHandler = (triggerInput: TTriggerType, context: InvocationContext) => {
      const nammathamContext = new NammathamContext(context, this.inputs, this.outputs);
      return func(triggerInput, nammathamContext);
    };
    return this;
  }

  build(): NammathamFunctionEndpoint<TTriggerType, TReturnType> {
    return {
      funcName: this.funcName,
      invokeHandler: this.invokeHandler,
      inputs: this.toInputList(),
      outputs: this.toOutputList(),
    };
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
