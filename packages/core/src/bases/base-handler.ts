import type { NammamthamEndpoint } from '../types';

export abstract class BaseHandler<Handler extends (...args: any[]) => any> {
  abstract build(): NammamthamEndpoint;
  abstract handler(func: Handler): this;
  abstract getHandler(): Handler;
}
