import { AuthorizationLevel, BaseController, controller, functionName, httpTrigger } from 'nammatham';
import { HttpRequest } from '@azure/functions';
import { Service } from './services';
import { inject } from 'inversify';

@controller()
export class WithServiceController extends BaseController {

  constructor(@inject(Service) private service: Service){
    super();
  }

  @functionName('WithService', httpTrigger(AuthorizationLevel.Anonymous, ['get']))
  public getName(req: HttpRequest): void {
    const name = req.query.name;
    this.context.log('Context Log');

    // this.res.send(`hello get user with ${name}`);
    this.res.json({
      data: `[WithService] hello get user with ${name} with data = ${this.service.getData()}`,
    });
  }
}


