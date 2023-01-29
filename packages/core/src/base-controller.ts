import { injectable } from 'inversify';
import { HttpResponse, Context } from './http';

@injectable()
export class BaseController {
  protected context!: Context;
  // @injectContext protected readonly context!: Context;
  protected res!: HttpResponse;

  public init(context: Context) {
    this.context = context;
    this.res = new HttpResponse(context);
  }
}
