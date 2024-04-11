import type { InvocationContext } from '@azure/functions';

import { BaseHandler, type WithEndpointOption } from '@nammatham/core';

import type { HandlerFunction, RegisterFunctionOption, AzureFunctionsEndpoint, FunctionOption } from './types';

import { NammathamContext } from './nammatham-context';

export class AzureFunctionsHandler<
  TTriggerType,
  TReturnType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExtraContext extends Record<string, unknown> = {}
> extends BaseHandler<HandlerFunction<TTriggerType, TReturnType, ExtraContext>> {
  extraContext: ExtraContext = {} as ExtraContext;
  protected funcHandler!: HandlerFunction<TTriggerType, TReturnType, ExtraContext>;

  constructor(
    public funcName: string,
    public functionOption: WithEndpointOption & FunctionOption,
    public registerFunc: RegisterFunctionOption
  ) {
    super();
  }

  handler(func: HandlerFunction<TTriggerType, TReturnType, ExtraContext>) {
    this.funcHandler = func;
    return this;
  }

  build(): AzureFunctionsEndpoint<TTriggerType, TReturnType> {
    const invokeHandler = (triggerInput: TTriggerType, innocationContext: InvocationContext) => {
      const nammathamContext = new NammathamContext(innocationContext, triggerInput);
      Object.assign(nammathamContext, this.extraContext);
      return this.funcHandler(nammathamContext as NammathamContext<TTriggerType> & ExtraContext);
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
    this.extraContext = { ...this.extraContext, ...context };
    return this as AzureFunctionsHandler<TTriggerType, TReturnType, ExtraContext & NewItem>;
  }

  getHandler() {
    return this.funcHandler;
  }
}
