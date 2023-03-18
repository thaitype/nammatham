import {
  context,
  functionName,
  httpTrigger,
  res,
  Request,
  Response,
  InvocationContext,
} from '@nammatham/core';
// TODO: using `inject` from `tsyringe` when they already fix type issue #221
import { controller, inject } from '@nammatham/tsyringe';
import { MyService } from './my-service';

@controller()
export class MyController {
  constructor(@inject(MyService) protected myService: MyService) {}

  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: Request,
    @res() res: Response,
    @context() context: InvocationContext
  ) {
    res.headers.set('rest', 'aaaa');
    context.info('hello from httpTrigger');
    return res.json({ name: `Service name is '${this.myService.name}'` });
  }
}
