import { BaseHandlerResolver } from '../../bases';

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override resolveHandler(): void {
    console.log(`Starting using Azure Functions handler resolver`);
  }
}
