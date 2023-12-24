import type { InvocationContext } from '@azure/functions';
import { NammathamContextBase } from '../../bases';

export class NammathamContext extends NammathamContextBase {
  constructor(public readonly context: InvocationContext) {
    super();
  }
}
