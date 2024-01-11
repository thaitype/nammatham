import type { InvocationContext } from '@azure/functions';
import type { WithEndpointOption } from '@nammatham/core';

import type { HandlerFunction, RegisterFunctionOption, AzureFunctionsEndpoint, FunctionOption } from './types';

import { NammathamContext } from './nammatham-context';

export class AzureFunctionsHandler<TTriggerType, TReturnType> {
  constructor(
    public funcName: string,
    public functionOption: WithEndpointOption & FunctionOption,
    public registerFunc: RegisterFunctionOption
  ) {}

  handler(func: HandlerFunction<TTriggerType, TReturnType>): AzureFunctionsEndpoint<TTriggerType, TReturnType> {
    const invokeHandler = (triggerInput: TTriggerType, context: InvocationContext) => {
      const nammathamContext = new NammathamContext(context, triggerInput);
      return func(nammathamContext);
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
