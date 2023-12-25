import { BaseHandlerResolver } from '../../bases';
import { AzureFunctionsEndpoint } from './types';
import { HttpRequest, InvocationContext } from '@azure/functions';

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override resolveHandler(invokeHandler: AzureFunctionsEndpoint<HttpRequest, any>['invokeHandler']) {
    console.log(`Starting using Azure Functions handler resolver`);
    // TODO: Mock Azure Functions's Http Request and InvocationContext
    return invokeHandler({} as HttpRequest, new InvocationContext());
  }
}
