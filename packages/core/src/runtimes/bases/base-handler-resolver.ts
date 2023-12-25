import { NammamthamEndpoint } from '../types';
import type { Request, Response } from 'express';

export abstract class BaseHandlerResolver {
  abstract resolveHandler(endpoint: NammamthamEndpoint, req: Request, res: Response): any;
}
