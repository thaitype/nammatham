import { BaseRuntimeAdapter, NammathamApp } from '@nammatham/core';
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
