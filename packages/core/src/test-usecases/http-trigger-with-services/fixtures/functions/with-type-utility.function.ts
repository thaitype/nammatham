import { inject } from 'inversify';
import { BaseFunction, Binding, functionName } from '../../../../main';
import { SingletonService } from '../services/singleton-service';
import { responseHelper, serviceData } from '../../../response-helper';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
  Binding.timerTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
];

const customBindings = Binding.custom({ name: 'req' as const, type: 'custom', 'direction': 'in' })

@functionName('WithTypeUtility', ...bindings, customBindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {
  constructor(@inject(SingletonService) private service: SingletonService) {
    super();
  }

  public override execute() {
    const { name } = this.req.query;
    this.res.send(responseHelper(name, this.service.getData(serviceData)));
  }
}
