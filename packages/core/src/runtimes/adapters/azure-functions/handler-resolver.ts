import { BaseHandlerResolver } from '../../bases';
import { InvocationContext } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import { PromiseLike } from '../../types';
import type { Request, Response } from 'express';
import { HttpRequest } from './http/HttpRequest';

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(endpoint: AzureFunctionsEndpoint<HttpRequest, PromiseLike<any>>, req: Request, res: Response) {
    console.log(`Starting using Azure Functions handler resolver`);
    // console.log(`Running handler from `, endpoint);
    // TODO: Mock Azure Functions's Http Request and InvocationContext
    return await endpoint.invokeHandler(new HttpRequest(req), this.mockInvocationContext());
  }

  protected mockInvocationContext(): InvocationContext {
    return new InvocationContext();
  }
}
