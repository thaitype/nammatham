import { NammathamApp } from 'packages/core/dist/main';
import { BaseRuntimeAdapter } from '../../base-runtime-adapter';
import { DefaultTrigger } from './trigger';

export class DefaultAdapter extends BaseRuntimeAdapter<DefaultTrigger> {
  createTrigger() {
    return new DefaultTrigger();
  }

  createApp() {
    return new NammathamApp();
  }
}
