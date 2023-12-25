import { NammathamContext } from './nammatham-context';
import type { InvocationContext } from '@azure/functions';
import type { HandlerFunction, InvokeFunctionOption, AzureFunctionsEndpoint, FunctionOption } from './types';

export class AzureFunctionsHandler<TTriggerType, TReturnType> {
  constructor(
    public funcName: string,
    public functionOption: FunctionOption,
    public invokeFunc: InvokeFunctionOption
  ) {}

  handler(func: HandlerFunction<TTriggerType, TReturnType>): AzureFunctionsEndpoint<TTriggerType, TReturnType> {
    const invokeHandler = (triggerInput: TTriggerType, context: InvocationContext) => {
      const nammathamContext = new NammathamContext(context);
      return func(triggerInput, nammathamContext);
    };
    return {
      ...this.functionOption,
      type: 'azureFunctions',
      name: this.funcName,
      invokeHandler,
    };
  }
}
