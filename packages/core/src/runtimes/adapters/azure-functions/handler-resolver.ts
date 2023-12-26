import { BaseHandlerResolver } from '../../bases';
import { InvocationContext } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import { PromiseLike } from '../../types';
import type { Request, Response } from 'express';
import { HttpRequest } from './http/HttpRequest';
import { NammathamApp } from '../../nammatham-app';
import { v4 as uuidv4 } from 'uuid';

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(
    endpoint: AzureFunctionsEndpoint<HttpRequest, PromiseLike<any>>,
    req: Request,
    res: Response
  ) {
    const context = new InvocationContext({
      invocationId: uuidv4(),
      functionName: endpoint.name
    });
    console.log(`Executing 'Functions.${endpoint.name}' (Reason='This function was programmatically called via the host APIs.', Id=${context.invocationId})`);
    return endpoint.invokeHandler(new HttpRequest(req), context).then((result: any) => {
      console.log(`Executed 'Functions.${endpoint.name}' (Succeeded, Id=${context.invocationId}, Duration=${0}ms)`);
      return result;
    });
  }

  override async resolveRegisterHandler(app: NammathamApp) {
    console.log(`Starting using Azure Functions register handler`);

    for(const func of app.functions) {
      console.log(`Registering function "${func.name}"`);
      if(func.type !== 'azureFunctions') continue;
      func.registerFunc(
        {
          ...func,
          handler: func.invokeHandler,
        }
      )
    }
  }

  protected mockInvocationContext(): InvocationContext {
    return new InvocationContext();
  }
}
