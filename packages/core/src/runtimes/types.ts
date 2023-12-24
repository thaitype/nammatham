import { AzureFunctionsEndpoint } from './adapters';

export type PromiseLike<T> = T | Promise<T>;

export interface NammathamGenericEndpoint extends Record<string, unknown> {
  type: 'generic';
  invokeHandler: (...args: any[]) => PromiseLike<any>;
}

export type NammamthamEndpoint = AzureFunctionsEndpoint<any, any> | NammathamGenericEndpoint;
