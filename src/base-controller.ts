import { injectable } from 'inversify';
import { Context } from '@azure/functions';
import { injectContext } from './decorators';
import { HttpResponse } from './http';

@injectable()
export class BaseController {
  protected res!: HttpResponse;
  constructor(@injectContext protected readonly context: Context) {
    console.log(`this.context = ${this.context}`)
    this.res = new HttpResponse(this.context);
  }

}
