import { inject } from 'inversify';
import { BaseFunction, httpTrigger, functionName, AuthorizationLevel } from '../../../../main';
import { SingletonService } from '../services/singleton-service';
import { responseHelper, serviceData } from '../../../response-helper';

@functionName('httpTriggerHelper', httpTrigger(AuthorizationLevel.Anonymous, ["get"], 'test'))
export class HttpTriggerHelperFunction extends BaseFunction {
  constructor(@inject(SingletonService) private service: SingletonService) {
    super();
  }

  public override execute() {
    const query = this.req?.query;
    this.res?.send(responseHelper(query?.name, this.service.getData(serviceData)));
  }
}
