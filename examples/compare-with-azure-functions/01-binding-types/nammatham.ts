// nammatham@1.2.0
import { BaseFunction } from 'nammatham';

const bindings = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  },
  {
    type: 'http',
    direction: 'out',
    name: 'res',
  },
] as const;

export class MyFunction extends BaseFunction<typeof bindings> {
  override execute() {
    const { req } = this.context.bindings;
    //       ^?
  }
}




