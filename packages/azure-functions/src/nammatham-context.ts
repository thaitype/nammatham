import type { InvocationContext } from '@azure/functions';
import { NammathamContextBase } from '@nammatham/core';

export class NammathamContext<TTriggerType> extends NammathamContextBase {
  constructor(public readonly context: InvocationContext, public readonly trigger: TTriggerType) {
    super();
  }
}
