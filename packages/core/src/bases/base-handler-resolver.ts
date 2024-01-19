import type { Request, Response } from 'express';

import type { NammathamApp } from '../nammatham-app';
import type { AfterServerStartedMetadata, NammamthamEndpoint } from '../types';

export abstract class BaseHandlerResolver {
  abstract resolveHandler(endpoint: NammamthamEndpoint, req: Request, res: Response): any;
  abstract resolveRegisterHandler(app: NammathamApp): any;
  abstract afterServerStarted(app: NammathamApp, metadata: AfterServerStartedMetadata): any;
}
