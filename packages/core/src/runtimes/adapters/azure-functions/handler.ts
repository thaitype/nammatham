import { NammathamContext } from './nammatham-context';
import type { PromiseLike } from '../../types';
import type { InvocationContext } from '@azure/functions';
import type { HandlerFunction, InvokeFunctionOption, NammathamFunctionEndpoint, FunctionOption } from './types';

export class AzureFunctionsHandler<TTriggerType, TReturnType> {
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
}
