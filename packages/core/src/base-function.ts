import { injectable } from 'inversify';
import { Context, HttpRequest } from '@azure/functions';
import { HttpResponseContext } from './http-response-context';
import { FunctionBinding, HttpType, HttpTriggerType } from './bindings';
import { IsBindingWith, TypedContext } from './interfaces';

/**
 * Base Class for entrypoint of Azure Function. It is required to use with Nammatham
 */

@injectable()
export abstract class BaseFunction<T extends readonly FunctionBinding<unknown>[] = any> {
  /**
   * The context object can be used for writing logs, reading data from bindings, setting outputs and using
   * the context.done callback when your exported function is synchronous. A context object is passed
   * to your function from the Azure Functions runtime on function invocation.
   *
   * @remark Extends from `Context` (@azure/functions)
   */
  protected context!: TypedContext<T>;
  /**
   * HTTP response object. Provided to your function when using HTTP Bindings.
   *
   * @remark Extends from `Context.res: HttpResponse` (@azure/functions)
   */
  protected res!: IsBindingWith<T, HttpType, HttpResponseContext>;
  /**
   * HTTP request object. Provided to your function when using HTTP Bindings.
   *
   * @remark Extends from `Context.req: HttpRequest` (@azure/functions)
   */
  protected req!: IsBindingWith<T, HttpTriggerType, HttpRequest>;
  /**
   * Allows you to write streaming function logs. Calling directly allows you to write streaming function logs
   * at the default trace level.
   *
   * @remark Extends from `Context.log: Logger` (@azure/functions)
   */
  protected log!: Context['log'];
  /**
   * Input and trigger binding data, as defined in function.json. Properties on this object are dynamically
   * generated and named based off of the "name" property in function.json.
   *
   * @remark Extends from `Context.bindings: Logger` (@azure/functions)
   */
  protected bindings!: TypedContext<T>['bindings'];

  public init(context: TypedContext<T>) {
    this.context = context;
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

  public getResponse(): IsBindingWith<T, HttpType, HttpResponseContext> {
    return this.res;
  }

  public getRequest(): IsBindingWith<T, HttpTriggerType, HttpRequest> {
    return this.req;
  }

  public getContext(): TypedContext<T> {
    return this.context;
  }
}
