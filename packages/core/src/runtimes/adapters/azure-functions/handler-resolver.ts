import { BaseHandlerResolver } from '../../bases';
import { InvocationContext } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import { PromiseLike } from '../../types';
import type { Request, Response } from 'express';
import { HttpRequest } from './http/HttpRequest';
import { NammathamApp } from '../../nammatham-app';
import { v4 as uuidv4 } from 'uuid';

function logExecutedFunction(startTime: number, endpoint: AzureFunctionsEndpoint<HttpRequest, string>, context: InvocationContext){
  const endTime = performance.now();
  const durationMs = Math.floor(endTime - startTime);
  console.log(`Executed 'Functions.${endpoint.name}' (Succeeded, Id=${context.invocationId}, Duration=${durationMs}ms)`);
}

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(
    endpoint: AzureFunctionsEndpoint<HttpRequest, string>,
    req: Request,
    res: Response
  ) {
    const context = new InvocationContext({
      invocationId: uuidv4(),
      functionName: endpoint.name
    });
    const startTime = performance.now();
    console.log(`Executing 'Functions.${endpoint.name}' (Reason='This function was programmatically called via the host APIs.', Id=${context.invocationId})`);
    const result = await endpoint.invokeHandler(new HttpRequest(req), context);
    logExecutedFunction(startTime, endpoint, context);
    return result;
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
