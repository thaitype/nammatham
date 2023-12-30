import { BaseRuntimeAdapter } from '../core/bases';
import { NammathamApp } from '../core/nammatham-app';
import { AzureFunctionsHandlerResolver } from './handler-resolver';
import { AzureFunctionsTrigger } from './trigger';

export class AzureFunctionsAdapter extends BaseRuntimeAdapter<AzureFunctionsTrigger> {
  createTrigger() {
    return new AzureFunctionsTrigger();
  }

  createApp() {
    return new NammathamApp(new AzureFunctionsHandlerResolver());
  }
}
