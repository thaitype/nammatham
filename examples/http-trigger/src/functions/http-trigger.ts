import {
  context,
  functionName,
  httpTrigger,
  Logger,
  logger,
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
    // @res() res: Response,
    @context() context: InvocationContext,
    @logger() log: Logger
  ): HttpResponse {
    const data = {
      name: 'aaa',
    };
    const res = new Response();
    res.headers.set('rest', 'aaaa');
    console.log('hello from httpTrigger');
    return res.jsonBody(data);
  }
}
