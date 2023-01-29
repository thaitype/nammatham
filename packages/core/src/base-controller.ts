import { injectable } from 'inversify';
import { Context } from '@azure/functions';
import { injectContext } from './decorators';
import { HttpResponse } from './http';

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
