import { BaseFunction, Binding, functionName } from '../../../../main';
import { responseHelper } from '../../../response-helper';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
  Binding.httpWithReturn(),
  Binding.timerTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
  Binding.cosmosDBTrigger({
    connection: '',
    containerName: '',
    databaseName: '',
    name: 'document_default'
  }),
  Binding.cosmosDBTrigger_v4({
    connection: '',
    containerName: '',
    databaseName: '',
    name: 'document_v4'
  })
];

const customBindings = Binding.custom({ name: 'req' as const, type: 'custom', direction: 'in' });

@functionName('AllBindingsFunction', ...bindings, customBindings)
export class AllBindingsFunction extends BaseFunction<typeof bindings> {
  public override execute() {
    const { name } = this.req.query;
    this.res.send(responseHelper(name));
  }
}
