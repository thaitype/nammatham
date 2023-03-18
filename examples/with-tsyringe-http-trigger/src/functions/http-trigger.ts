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
import { controller } from '@nammatham/tsyringe';
import { MyService } from '../my-service';
import { inject } from 'tsyringe';

@controller()
export class MyController {
  constructor(@inject('MyService') protected myService: MyService) {}

  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: Request,
    @res() res: Response,
    @context() context: InvocationContext
  ): HttpResponse {
    res.headers.set('rest', 'aaaa');
    context.info('hello from httpTrigger');
    return res.json({ name: `Service name is '${this.myService.name}'` });
  }
}
