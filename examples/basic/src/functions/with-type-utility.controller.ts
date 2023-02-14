import { inject } from 'inversify';
import { BaseFunction, Binding, functionName } from 'nammatham';
import { Service } from './services';
import { HttpResponse } from '@azure/functions';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const, direction: 'in', type: 'httpTrigger' }), // make string to literal type
  // Binding.http({ name: '$return' as const }), // make string to literal type
  Binding.httpWithReturn(),
];

@functionName('WithTypeUtility', ...bindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {
  constructor(@inject(Service) private service: Service) {
    super();
  }

  public override async execute() {
    const { name } = this.req.query;
    return this.res.send();
  }
}
