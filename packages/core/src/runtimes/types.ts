import { AzureFunctionsEndpoint } from './adapters';

export type PromiseLike<T> = T | Promise<T>;

export interface NammathamGenericEndpoint extends NammamthamEndpointBase, Record<string, unknown> {
  type: 'generic';
}

export interface NammamthamEndpointBase {
  name: string;
  route: string;
  invokeHandler: (...args: any[]) => PromiseLike<any>;
}

export type NammamthamEndpoint = AzureFunctionsEndpoint<any, any> | NammathamGenericEndpoint;

