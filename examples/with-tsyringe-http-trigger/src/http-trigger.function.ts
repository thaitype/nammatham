import { Context, FunctionName, HttpTrigger, Res, Request, Response, InvocationContext } from '@nammatham/core';
// TODO: using `inject` from `tsyringe` when they already fix type issue #221
import { Controller, Inject } from '@nammatham/tsyringe';
import { MyService } from './my-service';

@Controller()
export class MyController {
  constructor(@Inject(MyService) protected myService: MyService) {}

  @FunctionName('http')
  public httpTrigger(
    @HttpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: Request,
    @Res() res: Response,
    @Context() context: InvocationContext
  ) {
    res.headers.set('rest', 'aaaa');
    context.info('hello from httpTrigger');
    return res.json({ name: `Service name is '${this.myService.name}'` });
  }
}
