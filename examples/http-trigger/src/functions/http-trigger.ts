import { context, functionName, httpTrigger, Logger, logger, HttpResponse, Request, Response, InvocationContext} from '@nammatham/core';
import { controller } from '@nammatham/inversify';

@controller()
export class MyController {
  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: Request,
    // @res() res: Response,
    @context() context: InvocationContext,
    @logger() log: Logger
  ): HttpResponse{
    // log.info(req.toString());
    console.log('hello from httpTrigger');

    return {
      body: 'test'
    }
  }
}
