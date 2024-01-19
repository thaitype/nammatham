import type { NammathamApp } from '../nammatham-app';

export abstract class BaseRuntimeAdapter<FunctionTrigger> {
  abstract createTrigger(): FunctionTrigger;
  abstract createApp(): NammathamApp;
}
