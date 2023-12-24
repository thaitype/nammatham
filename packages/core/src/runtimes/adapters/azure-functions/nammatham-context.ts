import type { InvocationContext } from '@azure/functions';
import { NammathamContextBase } from '../../nammatham-context-base';

export class NammathamContext extends NammathamContextBase {
  constructor(public readonly context: InvocationContext) {
    super();
  }
}
