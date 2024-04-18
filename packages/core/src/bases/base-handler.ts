import type { NammamthamEndpoint } from '../types';

export abstract class BaseHandler<Handler extends (...args: any[]) => any> {
  public readonly __baseHandler: boolean = true;
  abstract build(): NammamthamEndpoint;
  abstract handler(func: Handler): this;
  abstract getHandler(): Handler;
}
