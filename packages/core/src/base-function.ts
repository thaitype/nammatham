import { injectable } from 'inversify';
import { Context, HttpRequest } from '@azure/functions';
import { HttpResponseContext } from './http-response-context';
import { FunctionBinding, HttpType, HttpTriggerType } from './bindings';
import { IsBindingWith, TypedContext, InvocationContext as InvocationContext } from './interfaces';

/**
 * Base Class for entrypoint of Azure Function. It is required to use with Nammatham
 */

@injectable()
export abstract class BaseFunction<T extends readonly FunctionBinding<unknown>[] = any> {
  /**
   * Wrapping `Context` from v3.x with `InvocationContext` from v4.x
   * 
   * The context object can be used for writing logs, reading data from bindings, setting outputs and using
   * the context.done callback when your exported function is synchronous. A context object is passed
   * to your function from the Azure Functions runtime on function invocation.
   *
   * @remark Extends from `Context` (@azure/functions)
   */
  protected context!: InvocationContext<T>;
  /**
   * HTTP response object. Provided to your function when using HTTP Bindings.
   *
   * @remark Extends from `Context.res: HttpResponse` (@azure/functions)
   * @deprecated please use in `context.res` instead
   */
  protected res!: IsBindingWith<T, HttpType, HttpResponseContext>;
  /**
   * HTTP request object. Provided to your function when using HTTP Bindings.
   *
   * @remark Extends from `Context.req: HttpRequest` (@azure/functions)
   * @deprecated please use in `context.req` instead
   */
  protected req!: IsBindingWith<T, HttpTriggerType, HttpRequest>;
  /**
   * Allows you to write streaming function logs. Calling directly allows you to write streaming function logs
   * at the default trace level.
   *
   * @remark Extends from `Context.log: Logger` (@azure/functions)
   * @deprecated please use in `context.log` instead
   */
  protected log!: Context['log'];
  /**
   * Input and trigger binding data, as defined in function.json. Properties on this object are dynamically
   * generated and named based off of the "name" property in function.json.
   *
   * @remark Extends from `Context.bindings: Logger` (@azure/functions)
   * @deprecated please use in `context.bindings` instead
   */
  protected bindings!: TypedContext<T>['bindings'];

  public init(context: TypedContext<T>) {
    this.context = {
      ...context,
      invocationId: context.bindingData.invocationId,
      functionName: context.executionContext.functionName,
      debug: context.log.verbose,
      error: context.log.error,
      info: context.log.info,
      warn: context.log.warn,
      retryContext: context.executionContext.retryContext ?? undefined,
      triggerMetadata: context.bindingData,
      // TODO: 
      extraInputs: null,
      extraOutputs: null,
    };
    this.log = context.log;
    this.bindings = context.bindings;
    if (context.res !== undefined)
      this.res = new HttpResponseContext(context) as IsBindingWith<T, HttpType, HttpResponseContext>;
    if (context.req !== undefined) this.req = context.req;
  }

  /**
   * Main entrypoint of the Azure Functions when executed
   */
  public abstract execute(...args: any[]): any;

  /**
   * @deprecated
   */
  public getResponse(): IsBindingWith<T, HttpType, HttpResponseContext> {
    return this.res;
  }

  /**
   * @deprecated
   */
  public getRequest(): IsBindingWith<T, HttpTriggerType, HttpRequest> {
    return this.req;
  }

  /**
   * @deprecated
   */
  public getContext(): TypedContext<T> {
    return this.context;
  }
}
