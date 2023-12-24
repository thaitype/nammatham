import { NammathamContext } from '../../../core/nammatham-context';
import {
  HandlerFunction,
  InvokeFunctionOption,
  NammathamFunctionEndpoint,
  FunctionOption,
  PromiseLike,
} from '../../../core/types';
import { InvocationContext } from '@azure/functions';

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
