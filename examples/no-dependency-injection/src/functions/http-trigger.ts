import { InvocationContext, HttpRequest } from '@azure/functions';
import { bareController ,context, functionName, httpTrigger, Logger, logger } from '@nammatham/core';

@bareController()
export class MyController {
  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: HttpRequest,
    @context() context: InvocationContext,
    @logger() log: Logger
  ) {
    console.log('hello from httpTrigger');
    console.log(req, context, log);
  }
}
