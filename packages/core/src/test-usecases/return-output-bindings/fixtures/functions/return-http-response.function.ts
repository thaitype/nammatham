import { BaseFunction, binding, functionName } from '../../../../main';
import { responseHelper } from '../../../response-helper';

const bindings = [
  binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  binding.http({ name: 'res' as const }), // make string to literal type
] as const;

const customBindings = binding.custom({ name: 'req' as const, type: 'custom', 'direction': 'in' })

@functionName('ReturnHttpResponseFunction', ...bindings, customBindings)
export class ReturnHttpResponseFunction extends BaseFunction<typeof bindings> {

  public override execute() {
    const { name } = this.req.query;
    return this.res.setHttpResponse({
      body: responseHelper(name)
    });
  }
}
