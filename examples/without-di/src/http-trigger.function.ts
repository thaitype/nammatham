import { InvocationContext } from '@azure/functions';
import { Request, BareController, Context, FunctionName, HttpTrigger, Res, Response } from '@nammatham/core';

@BareController()
export class MyController {
  @FunctionName('http')
  public httpTrigger(
    @HttpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: Request,
    @Res() res: Response,
    @Context() context: InvocationContext
  ) {
    context.log('Hi from log');
    return res.send('hello from httpTrigger without di');
  }
}
