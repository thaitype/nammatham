import { AuthorizationLevel, BaseController, controller, functionName, httpTrigger } from 'nammatham';
import { HttpRequest, ContextBindings } from '@azure/functions';

@controller()
export class MyHttpController extends BaseController {
  @functionName('MyHttp', httpTrigger(AuthorizationLevel.Anonymous, ['get']))
  public getName(bindings: ContextBindings, req: HttpRequest): void {
    const name = req.query.name;
    this.context.log('Context Log');

    // this.res.send(`hello get user with ${name}`);
    this.res.json({
      data: `[MyHttp] hello get user with ${name}}`,
    });
  }
}
