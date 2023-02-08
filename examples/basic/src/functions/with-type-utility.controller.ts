import { inject } from 'inversify';
import { BaseFunction, Binding, functionName } from 'nammatham';
import { Service } from './services';
import { HttpResponse } from '@azure/functions';

const bindings = [
  Binding.httpTriggerRequest({ name: 'req' as const }), // make string to literal type
  Binding.httpTriggerResponse({ name: 'res' as const }), // make string to literal type
];

@functionName('WithTypeUtility', ...bindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {

  constructor(@inject(Service) private service: Service){
    super();
  }
  
  public override execute() {
    const { req, res } = this.context.bindings;
    const name = req.query.name;
    this.context.res = {
      body: `hello WithTypeUtility with ${name} ${this.service.getData()}`,
    };
  }
}
