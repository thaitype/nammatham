import type { InvocationContext } from '@azure/functions';
import type { WithEndpointOption } from '@nammatham/core';

import type { HandlerFunction, RegisterFunctionOption, AzureFunctionsEndpoint, FunctionOption } from './types';

import { NammathamContext } from './nammatham-context';

export class AzureFunctionsHandler<TTriggerType, TReturnType, ExtraContex extends Record<string, unknown> = {}> {
  context: ExtraContex = {} as ExtraContex;

  constructor(
    public funcName: string,
    public functionOption: WithEndpointOption & FunctionOption,
    public registerFunc: RegisterFunctionOption
  ) {}

  handler(
    func: HandlerFunction<TTriggerType, TReturnType, ExtraContex>
  ): AzureFunctionsEndpoint<TTriggerType, TReturnType> {
    const invokeHandler = (triggerInput: TTriggerType, innocationContext: InvocationContext) => {
      const nammathamContext = new NammathamContext(innocationContext, triggerInput);
      return func({ ...nammathamContext, ...this.context });
    };
    return {
      ...this.functionOption,
      type: 'azure-functions',
      name: this.funcName,
      invokeHandler,
      registerFunc: this.registerFunc,
    };
  }

  setContext<NewItem extends Record<string, unknown>>(context: NewItem) {
    this.context = { ...this.context, ...context };
    return this as AzureFunctionsHandler<TTriggerType, TReturnType, ExtraContex & NewItem>;
  }
}
