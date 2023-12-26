import { BaseHandlerResolver } from '../../bases';
import { InvocationContext } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import { PromiseLike } from '../../types';
import type { Request, Response } from 'express';
import { HttpRequest } from './http/HttpRequest';
import { NammathamApp } from '../../nammatham-app';

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(
    endpoint: AzureFunctionsEndpoint<HttpRequest, PromiseLike<any>>,
    req: Request,
    res: Response
  ) {
    console.log(`Starting using Azure Functions handler resolver`);
    // console.log(`Running handler from `, endpoint);
    // TODO: Mock Azure Functions's Http Request and InvocationContext
    return await endpoint.invokeHandler(new HttpRequest(req), this.mockInvocationContext());
  }

  override async resolveRegisterHandler(app: NammathamApp) {
    console.log(`Starting using Azure Functions register handler`);

    for(const func of app.functions) {
      console.log(`Registering function "${func.name}"`);
      
    }
  }

  protected mockInvocationContext(): InvocationContext {
    return new InvocationContext();
  }
}
