import { Context, Logger } from '@azure/functions';

const logger = {
  error: (...args: any[]) => {},
  info: (...args: any[]) => {},
  warn: (...args: any[]) => {},
  verbose: (...args: any[]) => {},
} as Logger;

export class ContextFactory {
  public static createBuilder() {
    return new ContextBuilder();
  }
}

export class ContextBuilder {
  public context: Context;
  constructor() {
    this.context = this.initEmptyContext();
  }

  private initEmptyContext(): Context {
    return {
      bindingData: {
        invocationId: '',
      },
      bindingDefinitions: [],
      bindings: {},
      executionContext: { functionDirectory: '', functionName: '', invocationId: '', retryContext: null },
      invocationId: '',
      log: logger,
      traceContext: { attributes: {}, traceparent: null, tracestate: '' },
      req: {} as Context['req'],
      res: {} as Context['res'],
      suppressAsyncDoneError: undefined,
      done: () => {},
    } as Context;
  }

  public setInvocationId(id: Context['invocationId']){
    // TODO: this should confirm the Azure Function Runtime injection again.
    this.context.bindingData.invocationId = id;
    this.context.executionContext.invocationId = id;
    this.context.invocationId = id;
    return this;
  }

  public setRequest(req: Partial<Context['req']>, bindingName: string = 'req'){
    this.context.req = req as Context['req'];
    this.context.bindings[bindingName] = req;
    return this;
  }

  public setResponse(res: Partial<Context['res']>, bindingName: string = 'res'){
    this.context.res = res as Context['res'];
    this.context.bindings[bindingName] = res;
    return this;
  }

  public getContext(): Context {
    return this.context;
  }

}