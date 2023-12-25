import { AzureFunctionsEndpoint } from './adapters';

export type PromiseLike<T> = T | Promise<T>;

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PATCH' | 'PUT' | 'OPTIONS' | 'TRACE' | 'CONNECT';

export interface EndpointOptionBase {
  type: string;
}

export interface HttpEndpointOption extends EndpointOptionBase {
  type: 'http';
  route: string;
  /**
   * Http Methods
   * @default ['GET']
   */
  methods?: HttpMethod[];
}

export interface GenericEndpointOption extends EndpointOptionBase, Record<string, unknown> {
  type: 'generic';
}

export interface NammathamGenericEndpoint extends NammamthamEndpointBase, Record<string, unknown> {
  type: 'generic';
}

export type NammamthamEndpoint = AzureFunctionsEndpoint<any, any> | NammathamGenericEndpoint;
export type EndpointOption = HttpEndpointOption | GenericEndpointOption;

export type WithEndpointOption = { endpointOption?: Partial<EndpointOption> };

export interface NammamthamEndpointBase {
  name: string;
  endpointOption?: EndpointOption;
  invokeHandler: (...args: any[]) => PromiseLike<any>;
}
