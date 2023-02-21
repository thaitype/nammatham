import 'reflect-metadata';
import { inject } from 'inversify';
import { BaseFunction, binding, functionName } from '../../../../../src/main';
import { Service } from './services';

const bindings = [
  binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  binding.http({ name: 'res' as const }), // make string to literal type
] as const;

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
