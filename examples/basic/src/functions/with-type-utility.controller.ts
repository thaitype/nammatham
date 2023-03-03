import { inject } from 'inversify';
import { binding as input, BaseFunction, functionName } from 'nammatham';
import { Service } from './services';

const bindings = [
  input.httpTrigger({ name: 'req' as const }), // make string to literal type
  input.http_withReturn()
] as const;

@functionName('WithTypeUtility', ...bindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {


  constructor(@inject(Service) private service: Service) {
    super();
  }

  public override execute() : input.inferReturn<typeof bindings> {
    const { name } = this.context.req.query;
    // this.context.trigger
    return {
      body: `hello WithTypeUtility with ${name} ${this.service.getData()}`
    }
  }
}
