import { BaseFunction, binding, functionName } from '../../../../main';
import { responseHelper } from '../../../response-helper';
import { HttpRequest, HttpResponse, Timer } from '@azure/functions';

const bindings = [
  binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  binding.http({ name: 'res' as const }), // make string to literal type
  binding.http_withReturn(),
  binding.timerTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
  binding.cosmosDBTrigger_v2({
    name: 'document_trigger_v2' as const,
    collectionName: '',
    connectionStringSetting: '',
    databaseName: '',
  }),
  binding.cosmosDBTrigger_v4({
    name: 'document_trigger_v4' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  binding.cosmosDBTrigger({
    name: 'document_trigger_default' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  binding.cosmosDB_output_v2({
    name: 'document_output_v2' as const,
    collectionName: '',
    connectionStringSetting: '',
    createIfNotExists: true,
    databaseName: '',
  }),
  binding.cosmosDB_output_v4({
    name: 'document_output_v4' as const,
    createIfNotExists: true,
    databaseName: '',
    connection: '',
    containerName: '',
  }),
  binding.cosmosDB_output({
    name: 'document_output_default' as const,
    createIfNotExists: true,
    databaseName: '',
    connection: '',
    containerName: '',
  }),
  binding.cosmosDB_input_v2({
    name: 'document_input_v2' as const,
    collectionName: '',
    connectionStringSetting: '',
    databaseName: '',
    id: '',
    partitionKey: '',
    sqlQuery: '',
  }),
  binding.cosmosDB_input_v4({
    name: 'document_input_v4' as const,
    databaseName: '',
    id: '',
    partitionKey: '',
    sqlQuery: '',
    connection: '',
    containerName: '',
  }),
  binding.cosmosDB_input({
    name: 'document_input_default' as const,
    databaseName: '',
    id: '',
    partitionKey: '',
    sqlQuery: '',
    connection: '',
    containerName: '',
  }),
  binding.blobTrigger({
    connection: '',
    name: 'blob_trigger' as const,
    path: '',
  }),
  binding.blob_input({
    connection: '',
    name: 'blob_input' as const,
    path: '',
  }),
  binding.blob_output({
    connection: '',
    name: 'blob_output' as const,
    path: '',
  }),
] as const;

const customBindings = binding.custom({ name: 'req' as const, type: 'custom', direction: 'in' });

@functionName('AllBindingsFunction', ...bindings, customBindings)
export class AllBindingsFunction extends BaseFunction<typeof bindings> {
  public override execute() {
    const req: HttpRequest = this.bindings.req;
    const res: HttpResponse = this.bindings.res;
    const timer: Timer = this.bindings.timer;

    const document_output_v2: any = this.bindings.document_output_v2;
    const document_output_v4: any = this.bindings.document_output_v4;
    const document_output_default: any = this.bindings.document_output_default;

    const document_input_v2: any = this.bindings.document_input_v2;
    const document_input_v4: any = this.bindings.document_input_v4;
    const document_input_default: any = this.bindings.document_input_default;

    const document_trigger_v2: any = this.bindings.document_trigger_v2;
    const document_trigger_v4: any = this.bindings.document_trigger_v4;
    const document_trigger_default: any = this.bindings.document_trigger_default;

    const blob_trigger: any = this.bindings.blob_trigger;
    const blob_input: any = this.bindings.blob_input;
    const blob_output: any = this.bindings.blob_output;

    const { name } = this.req.query;
    this.res.send(responseHelper(name));
  }
}
