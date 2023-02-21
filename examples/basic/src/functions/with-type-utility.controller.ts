import { inject } from 'inversify';
import { binding, BaseFunction, functionName } from 'nammatham';
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
    const { name } = this.req.query;
    this.res.send(`hello WithTypeUtility with ${name} ${this.service.getData()}`);
  }
}
