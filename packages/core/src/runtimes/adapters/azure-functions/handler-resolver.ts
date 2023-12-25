import { BaseHandlerResolver } from '../../bases';
import { HttpRequest, InvocationContext } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import { PromiseLike } from '../../types';

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(endpoint: AzureFunctionsEndpoint<HttpRequest, PromiseLike<any>>) {
    console.log(`Starting using Azure Functions handler resolver`);
    // console.log(`Running handler from `, endpoint);
    // TODO: Mock Azure Functions's Http Request and InvocationContext
    return await endpoint.invokeHandler({} as HttpRequest, new InvocationContext());
  }
}
