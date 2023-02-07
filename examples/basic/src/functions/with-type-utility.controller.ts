import { inject } from 'inversify';
import { BaseFunction, Binding, functionName } from 'nammatham';
import { Service } from './services';

const bindings = [
  Binding.httpTriggerRequest({ name: 'req' as const }), // make string to literal type
  Binding.httpTriggerResponse({ name: 'res' as const }), // make string to literal type
];

@functionName('WithTypeUtility', ...bindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {

  constructor(@inject(Service) private service: Service){
    super();
  }
  
  public execute() {
    const { req, res } = this.context.bindings;
    const name = req.query.name;
    this.context.res = {
      body: `hello WithTypeUtility with ${name} ${this.service.getData()}`,
    };
  }
}
