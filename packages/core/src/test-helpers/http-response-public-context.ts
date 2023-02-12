import { TypedContext } from '../interfaces';
import { HttpResponseContext } from '../http-response-context';

export class HttpResponseContext_TestHelper extends HttpResponseContext {
  constructor(public readonly context: TypedContext<any>) {
    super(context);
  }
}
