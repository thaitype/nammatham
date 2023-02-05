import {  BaseFunction, Binding, controller, functionName } from 'nammatham';

const bindings = [
  Binding.httpTriggerRequest({ name: 'req' as const }), // make string to literal type
  Binding.httpTriggerResponse({ name: 'res' as const }), // make string to literal type
];

@controller()
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {
  // TODO: Move functionName to class level 
  @functionName('WithTypeUtility', ...bindings)
  public execute(): void {
    const { req, res } = this.context.bindings;
    const name = req.query.name;
    this.context.res = {
      body: `hello WithTypeUtility with ${name}`,
    };
  }
}
