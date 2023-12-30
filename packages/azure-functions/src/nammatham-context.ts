import type { InvocationContext } from '@azure/functions';
import { NammathamContextBase } from '@nammatham/core';

export class NammathamContext extends NammathamContextBase {
  constructor(public readonly context: InvocationContext) {
    super();
  }
}
