import { inject } from 'inversify';
import { BaseFunction, Binding, functionName } from '../../../../../src/main';
import { Service } from './services';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
];

@functionName('WithTypeUtility', ...bindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {
  constructor(@inject(Service) private service: Service) {
    super();
  }

  public override execute() {
    this.context.res = {
      body: this.service.getData('serviceData')
    }
  }
}
