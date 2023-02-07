import { BaseFunction, Binding, functionName } from 'nammatham';

const bindings = [
  Binding.httpTriggerRequest({ name: 'req' as const }), // make string to literal type
  Binding.httpTriggerResponse({ name: 'res' as const }), // make string to literal type
];

// the type should be supported by Azure Functions runtime
const customBindings = Binding.custom({ name: 'custom' as const, direction: 'in', type: 'customTrigger' });

@functionName('CustomType', ...bindings, customBindings)
export class CustomTypeFunction extends BaseFunction<typeof bindings> {
  public execute() {
    const { req, custom } = this.context.bindings;
    console.log(`Do something with custom binding ${custom}`);
    const name = req.query.name;

    this.context.res = {
      body: `hello get user with ${name}}`,
    };
  }
}
