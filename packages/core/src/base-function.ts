import { injectable } from 'inversify';
import { HttpResponse } from '@azure/functions';
import { HttpResponseContext } from './http';
import { FunctionBinding, HttpTriggerResponseType } from './bindings';
import { IsBindingWith, TypedContext } from './interfaces';

@injectable()
export abstract class BaseFunction<T extends readonly FunctionBinding<unknown>[] = any> {
  
  protected context!: TypedContext<T>;
  protected res!: IsBindingWith<T, HttpTriggerResponseType, HttpResponseContext>;

  public init(context: TypedContext<T>) {
    this.context = context;
    if (context.res !== undefined)
      this.res = new HttpResponseContext(context) as IsBindingWith<T, HttpTriggerResponseType, HttpResponseContext>;
  }

  public abstract execute(...args: any[]): void | HttpResponse;
}
