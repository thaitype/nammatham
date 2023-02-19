# All Built-in Binding Type

You can see all built-in binding type in [test case](packages/core/src/test-usecases/all-bindings/fixtures/functions/all-bindings.function.ts) as shown below:

```ts
import { BaseFunction, Binding, functionName } from '../../../../main';
import { responseHelper } from '../../../response-helper';
import { HttpRequest, HttpResponse, Timer} from '@azure/functions';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
  Binding.httpWithReturn(),
  Binding.timerTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
  Binding.cosmosDBTrigger_v2({
    name: 'document_input_v2' as const,
    collectionName: '',
    databaseName: '',
    connectionStringSetting: '' ,
  }),
  Binding.cosmosDB_v2({
    name: 'document_output_v2' as const,
    collectionName: '',
    createIfNotExists: true,
    databaseName: '',
    partitionKey: ''
  }),
  Binding.cosmosDBTrigger_v4({
    name: 'document_input_v4' as const,
    connection: '',
    containerName: '',
    databaseName: '',
  }),
  Binding.cosmosDB_v4({
    name: 'document_output_v4' as const,
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
  Binding.cosmosDB({
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
```