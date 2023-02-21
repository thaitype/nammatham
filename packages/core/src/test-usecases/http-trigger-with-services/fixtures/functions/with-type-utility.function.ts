import { inject } from 'inversify';
import { BaseFunction, binding, functionName } from '../../../../main';
import { SingletonService } from '../services/singleton-service';
import { responseHelper, serviceData } from '../../../response-helper';
import { TransientService } from '../services/transient-service';
import { ScopedService } from '../services/scoped-service';

const bindings = [
  binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  binding.http({ name: 'res' as const }), // make string to literal type
] as const;

@functionName('WithTypeUtility', ...bindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {
  constructor(
    @inject(SingletonService) private singletonService: SingletonService,
    @inject(TransientService) private transientService: TransientService,
    @inject(ScopedService) private scopedService: ScopedService
  ) {
    super();
  }

  public override execute() {
    const { name } = this.req.query;
    this.res.send(
      responseHelper(
        name,
        this.singletonService.getData(serviceData),
        this.scopedService.getData(serviceData),
        this.transientService.getData(serviceData)
      )
    );
  }
}
