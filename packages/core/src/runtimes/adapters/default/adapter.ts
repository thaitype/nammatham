import { NammathamApp } from '../../nammatham-app';
import { BaseRuntimeAdapter } from '../../bases';
import { DefaultTrigger } from './trigger';
import { DefaultHandlerResolver } from './handler-resolver';

export class DefaultAdapter extends BaseRuntimeAdapter<DefaultTrigger> {
  createTrigger() {
    return new DefaultTrigger();
  }

  createApp() {
    return new NammathamApp(new DefaultHandlerResolver());
  }
}
