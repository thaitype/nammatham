import {
  context,
  functionName,
  httpTrigger,
  res,
  HttpResponse,
  Request,
  Response,
  InvocationContext,
} from '@nammatham/core';
import { controller } from '@nammatham/inversify';

@controller()
export class MyController {

  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: Request,
    @res() res: Response,
    @context() context: InvocationContext,
  ): HttpResponse {
    
    res.headers.set('rest', 'aaaa');
    context.info('hello from httpTrigger');
    return res.jsonBody({
      name: 'aaa',
    });
  }
}
