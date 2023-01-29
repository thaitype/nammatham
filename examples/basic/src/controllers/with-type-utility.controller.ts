import { AuthorizationLevel, BaseController, Binding, controller, functionName, httpTrigger } from 'nammatham';

@controller()
export class MyHttpController extends BaseController {
  @functionName('MyHttp', httpTrigger(AuthorizationLevel.Anonymous, ['get']))
  //  BindingType<'httpTrigger'> will return `HttpRequest` type
  public getName(req: Binding<'httpTrigger'>): void {
    const name = req.query.name;
    this.res.send(`hello get user with ${name}`);
  }
}