import {
  AuthorizationLevel,
  BaseController,
  controller,
  functionName,
  httpTrigger,
} from 'nammatham';
import { HttpRequest } from '@azure/functions';
import { inject } from 'inversify';
import { Service } from './services';


@controller()
export class MyHttpController extends BaseController {

  @functionName("MyHttp", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
  public getName(req: HttpRequest): void {
    const name = req.query.name;
    this.context.log('Context Log');

    // this.res.send(`hello get user with ${name}`);
    this.res.json({
      data: `[MyHttp] hello get user with ${name}}`,
    });
  }
  
}


