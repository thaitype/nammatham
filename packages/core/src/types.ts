import type { IncomingMessage, ServerResponse as _ServerResponse } from 'node:http';

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

export type EndpointOption = HttpEndpointOption | GenericEndpointOption;

export type WithEndpointOption = { endpointOption?: EndpointOption };

export interface NammamthamEndpoint {
  type: string;
  name: string;
  endpointOption?: EndpointOption;
  invokeHandler: (...args: any[]) => PromiseLike<any>;
}

export interface AfterServerStartedMetadata {
  port?: number;
  allowAllFunctionsAccessByHttp?: boolean;
}

export type ServerResponse = _ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};
export type ServerRequest = IncomingMessage;
