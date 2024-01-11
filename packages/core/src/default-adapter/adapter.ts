import { DefaultTrigger } from './trigger';
import { BaseRuntimeAdapter } from '../bases';
import { NammathamApp } from '../nammatham-app';
import { DefaultHandlerResolver } from './handler-resolver';

export class DefaultAdapter extends BaseRuntimeAdapter<DefaultTrigger> {
  createTrigger() {
    return new DefaultTrigger();
  }

  createApp() {
    return new NammathamApp(new DefaultHandlerResolver());
  }
}
