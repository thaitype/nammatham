import { NammathamContext } from './nammatham-context';
import {
  FunctionBinding,
  HandlerFunction,
  InvokeFunctionOption,
  NammathamFunctionEndpoint,
  FunctionOption,
  PromiseLike,
} from './types';
import { InvocationContext } from '@azure/functions';

export class NammathamFunction<TTriggerType, TReturnType> {
  protected invokeHandler!: (triggerInput: TTriggerType, context: InvocationContext) => PromiseLike<TReturnType>;

  constructor(
    public funcName: string,
    public functionOption: FunctionOption,
    public invokeFunc: InvokeFunctionOption
  ) {}

  handler(func: HandlerFunction<TTriggerType, TReturnType>): NammathamFunctionEndpoint<TTriggerType, TReturnType> {
    this.invokeHandler = (triggerInput: TTriggerType, context: InvocationContext) => {
      const nammathamContext = new NammathamContext(context);
      return func(triggerInput, nammathamContext);
    };
    return {
      funcName: this.funcName,
      invokeHandler: this.invokeHandler,
      ...this.functionOption,
    };
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
}
