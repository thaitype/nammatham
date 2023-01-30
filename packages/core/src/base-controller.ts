import { injectable } from 'inversify';
import { HttpResponseContext, Context } from './http';

@injectable()
export class BaseController {
  protected context!: Context;
  // @injectContext protected readonly context!: Context;
  protected res!: HttpResponseContext;

  public init(context: Context) {
    this.context = context;
    this.res = new HttpResponseContext(context);
  }
}
