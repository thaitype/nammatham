import { BaseRuntimeAdapter } from '../../bases';
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
