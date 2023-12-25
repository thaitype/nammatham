import { AzureFunctionsEndpoint } from './adapters';

export type PromiseLike<T> = T | Promise<T>;

export interface NammathamGenericEndpoint extends NammamthamEndpointBase, Record<string, unknown> {
  type: 'generic';
}
export type AllowFunctionType = 'http' | 'generic';

export interface NammamthamEndpointBase {
  name: string;
  route: string;
  functionType: AllowFunctionType;
  invokeHandler: (...args: any[]) => PromiseLike<any>;
}

export type NammamthamEndpoint = AzureFunctionsEndpoint<any, any> | NammathamGenericEndpoint;

