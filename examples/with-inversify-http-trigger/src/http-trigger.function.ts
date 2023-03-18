import {
  context,
  functionName,
  httpTrigger,
  res,
  Request,
  Response,
  InvocationContext,
} from '@nammatham/core';
import { controller } from '@nammatham/inversify';
import { MyService } from './my-service';
import { inject } from 'inversify';

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
