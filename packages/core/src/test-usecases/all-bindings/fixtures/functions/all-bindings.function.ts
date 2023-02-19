import { BaseFunction, Binding, functionName } from '../../../../main';
import { responseHelper } from '../../../response-helper';
import { HttpRequest, HttpResponse, Timer} from '@azure/functions';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
  Binding.http_withReturn(),
  Binding.timerTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
  Binding.cosmosDBTrigger_v2({
    name: 'document_input_v2',
    collectionName: '',
    connection: '',
    connectionStringSetting: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDBTrigger_v4({
    name: 'document_input_v4' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDBTrigger({
    name: 'document_input_default' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDB_output_v2({
    name: 'document_output_v2' as const,
    collectionName: '',
    createIfNotExists: true,
    databaseName: '',
    partitionKey: ''
  }),
  Binding.cosmosDB_output_v4({
    name: 'document_output_v4' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDB_output({
    name: 'document_output_default' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
] as const;

const customBindings = Binding.custom({ name: 'req' as const, type: 'custom', direction: 'in' });

@functionName('AllBindingsFunction', ...bindings, customBindings)
export class AllBindingsFunction extends BaseFunction<typeof bindings> {
  public override execute() {
    const req: HttpRequest = this.bindings.req;
    const res: HttpResponse = this.bindings.res;
    const timer: Timer = this.bindings.timer;
    const document_input_v2: any = this.bindings.document_input_v2;
    const document_output_v2: any = this.bindings.document_output_v2;
    const document_input_v4: any = this.bindings.document_input_v4;
    const document_output_v4: any = this.bindings.document_output_v4;
    const document_input_default: any = this.bindings.document_input_default;
    const document_output_default: any = this.bindings.document_output_default;
    const { name } = this.req.query;
    this.res.send(responseHelper(name));
  }
}