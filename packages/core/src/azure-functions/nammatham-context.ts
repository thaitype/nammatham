import type { InvocationContext } from '@azure/functions';
import { NammathamContextBase } from '../core/bases';

export class NammathamContext extends NammathamContextBase {
  constructor(public readonly context: InvocationContext) {
    super();
  }
}
