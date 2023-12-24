import { BaseRuntimeAdapter } from '../../base-runtime-adapter';
import { NammathamApp } from '../../nammatham-app';
import { AzureFunctionsTrigger } from './trigger';

export class AzureFunctionsAdapter extends BaseRuntimeAdapter<AzureFunctionsTrigger> {
  
  createTrigger() {
    return new AzureFunctionsTrigger();
  }

  createApp() {
    return new NammathamApp();
  }
}
