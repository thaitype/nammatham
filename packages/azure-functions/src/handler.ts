import { NammathamContext } from './nammatham-context';
import type { InvocationContext } from '@azure/functions';
import type { HandlerFunction, RegisterFunctionOption, AzureFunctionsEndpoint, FunctionOption } from './types';

export class AzureFunctionsHandler<TTriggerType, TReturnType> {
  constructor(
    public funcName: string,
    public functionOption: FunctionOption,
    public registerFunc: RegisterFunctionOption
  ) {}

  handler(func: HandlerFunction<TTriggerType, TReturnType>): AzureFunctionsEndpoint<TTriggerType, TReturnType> {
    const invokeHandler = (triggerInput: TTriggerType, context: InvocationContext) => {
      const nammathamContext = new NammathamContext(context);
      return func(triggerInput, nammathamContext);
    };
    return {
      ...this.functionOption,
      type: 'azure-functions',
      name: this.funcName,
      invokeHandler,
      registerFunc: this.registerFunc,
    };
  }
}
