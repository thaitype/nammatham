import { BaseFunction, binding, functionName } from 'nammatham';

const bindings = [
  binding.http({ name: 'res' as const }), // make string to literal type
] as const;

// the type should be supported by Azure Functions runtime
const customBindings = binding.custom({ name: 'req' as const, direction: 'in', type: 'httpTrigger' });

@functionName('CustomType', ...bindings, customBindings)
export class CustomTypeFunction extends BaseFunction<typeof bindings> {
  public override execute() {
    const { req } = this.context.bindings;
    //       ^---- using custom type with name `req`, make this is `any` type
    const name = req.query.name;
    this.context.res = {
      body: `hello get user with ${name}}`,
    };
  }
}
