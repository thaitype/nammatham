import type { NammathamApp } from '../nammatham-app';
import type { AfterServerStartedMetadata, ServerRequest, ServerResponse, NammamthamEndpoint } from '../types';

export interface BaseHandlerResolverOptions {
  prefixPath?: string;
}

export abstract class BaseHandlerResolver {
  public readonly prefixPath: string;
  constructor(public option?: BaseHandlerResolverOptions) {
    this.prefixPath = option?.prefixPath ?? '';
  }
  abstract resolveHandler(endpoint: NammamthamEndpoint, req: ServerRequest, res: ServerResponse): any;
  abstract resolveRegisterHandler(app: NammathamApp): any;
  abstract afterServerStarted(app: NammathamApp, metadata: AfterServerStartedMetadata): any;
}
