import { injectable } from 'inversify';
import { HttpResponseContext, Context } from './http';
import { FunctionBinding, TypedContext } from './bindings';

@injectable()
export abstract class BaseFunction<T extends readonly FunctionBinding<unknown>[] = any> {
  protected context!: TypedContext<T>;
  // @injectContext protected readonly context!: Context;
  protected res!: HttpResponseContext;

  public init(context: TypedContext<T>) {
    this.context = context;
    this.res = new HttpResponseContext(context);
  }

  public execute(...args: []){}
}
