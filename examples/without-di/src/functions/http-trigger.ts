import { InvocationContext } from '@azure/functions';
import { Request, bareController, context, functionName, httpTrigger, res, Response } from '@nammatham/core';

@bareController()
export class MyController {
  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: Request,
    @res() res: Response,
    @context() context: InvocationContext
  ) {
    context.log('Hi from log');
    return res.send('hello from httpTrigger without di');
  }
}
