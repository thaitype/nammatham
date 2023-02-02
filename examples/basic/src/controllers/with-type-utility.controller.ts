import {
  BaseController,
  controller,
  functionName,
  GetContextBindings,
  HttpTriggerRequestBinding,
  HttpTriggerResponseBinding,
  CustomFunctionBinding,
  FunctionBinding
} from 'nammatham';

const functionConfig = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  } as HttpTriggerRequestBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpTriggerResponseBinding<'res'>,
];

const functionConfig3: readonly FunctionBinding<unknown>[] = [{
  name: 'req',
  type: 'httpTrigger',
  direction: 'in',
}] as const;

const unsupportType : CustomFunctionBinding<'unsupport'> = {
  name: 'unsupport',
  type: 'unsupport-type',
  direction: 'in',
};

@controller()
export class WithTypeUtilityController extends BaseController {
  
  // `unsupport-type` will make the function disable
  // This only show how to use `CustomFunctionBinding`
  @functionName('WithTypeUtility', ...functionConfig, /** unsupportType **/)
  public getName({ req, unsupport }: GetContextBindings<typeof functionConfig>): void {
    const name = req.query.name;
    this.context.res = {
      body: `hello WithTypeUtility with ${name}, unsupport value = ${unsupport}`
    }
  }
}
