import { BaseFunction, Binding, functionName } from '../../../../main';
import { responseHelper } from '../../../response-helper';
import { HttpRequest, HttpResponse, Timer} from '@azure/functions';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
  Binding.httpWithReturn(),
  Binding.timerTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
  Binding.cosmosDBTrigger_Input_v2({
    collectionName: '',
    databaseName: '',
    name: 'document_input_v2' as const,
    connectionStringSetting: '' ,
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
    const { name } = this.req.query;
    this.res.send(responseHelper(name));
  }
}

// TODO: binding type is duplicate, make is never
