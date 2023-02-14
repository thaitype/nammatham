import { injectable } from 'inversify';
import { HttpRequest, HttpResponse } from '@azure/functions';
import { HttpResponseContext } from './http-response-context';
import { FunctionBinding, HttpType, HttpTriggerType } from './bindings';
import { IsBindingWith, TypedContext } from './interfaces';

@injectable()
export abstract class BaseFunction<T extends readonly FunctionBinding<unknown>[] = any> {
  protected context!: TypedContext<T>;
  protected res!: IsBindingWith<T, HttpType, HttpResponseContext>;
  protected req!: IsBindingWith<T, HttpTriggerType, HttpRequest>;

  public init(context: TypedContext<T>) {
    this.context = context;
    if (context.res !== undefined)
      this.res = new HttpResponseContext(context) as IsBindingWith<T, HttpType, HttpResponseContext>;
    if (context.req !== undefined) this.req = context.req;
  }

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
