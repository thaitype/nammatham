import { BaseHandlerResolver } from '../../bases';
import { AzureFunctionsEndpoint } from './types';
import { InvocationContext } from '@azure/functions';

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override resolveHandler(invokeHandler: AzureFunctionsEndpoint<any, any>['invokeHandler']) {
    console.log(`Starting using Azure Functions handler resolver`);
    // TODO: Mock Azure Functions's Http Request and InvocationContext
    return invokeHandler('triggerInput', new InvocationContext());
  }
}
