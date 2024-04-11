import { type InvocationContext } from '@azure/functions';

import { HttpResponse } from './http/HttpResponse';

export class NammathamContext<TTriggerType> extends HttpResponse {
  constructor(public readonly context: InvocationContext, public readonly trigger: TTriggerType) {
    super();
  }
}
