import { TypedContext } from '../interfaces';
import { HttpResponseContext, HttpStatus } from '../http-response-context';

export class HttpResponseContext_TestHelper extends HttpResponseContext {
  public statusCode!: HttpStatus;
  constructor(public readonly context: TypedContext<any>) {
    super(context);
  }
}
