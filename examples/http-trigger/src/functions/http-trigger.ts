import {
  context,
  functionName,
  httpTrigger,
  Logger,
  log,
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
    @log() logger: Logger
  ): HttpResponse {
    const res = new Response();
    const data = {
      name: 'aaa',
    };
    res.headers.set('rest', 'aaaa');
    logger.info('hello from httpTrigger');
    return res.jsonBody(data);
  }
}
