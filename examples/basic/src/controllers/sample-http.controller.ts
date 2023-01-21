import {
  AuthorizationLevel,
  BaseController,
  controller,
  functionName,
  httpTrigger,
} from 'nammatham';
import { HttpRequest } from '@azure/functions';

@controller()
export class SampleHttpController extends BaseController {

  @functionName("SampleHttp", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
  public getName(req: HttpRequest): void {
    const name = req.query.name;
    this.context.log('Context Log');

    // this.res.send(`hello get user with ${name}`);
    this.res.json({
      data: `hello get user with ${name}`,
    });
  }
  
  /**
   * To support other trigger type,
   * Using Custom Function Binding instead
   */

  @functionName<string>('SampleCustomFunctionBinding', {
    name: 'SampleCustomFunctionBinding',
    // Note: this type is not available in Azure Functions
    type: 'custom-type',
    direction: 'in'
  })
  public customFunctionBinding(): void {
    this.context.log(`Running custom binding funtion`);
  }
}


