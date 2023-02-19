import { BaseFunction, Binding, functionName } from '../../../../main';
import { responseHelper } from '../../../response-helper';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
] as const;

const customBindings = Binding.custom({ name: 'req' as const, type: 'custom', 'direction': 'in' })

@functionName('ReturnHttpResponseFunction', ...bindings, customBindings)
export class ReturnHttpResponseFunction extends BaseFunction<typeof bindings> {

  public override execute() {
    const { name } = this.req.query;
    return this.res.setHttpResponse({
      body: responseHelper(name)
    });
  }
}
