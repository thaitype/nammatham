import { NammamthamEndpoint } from '../types';
import type { Request, Response } from 'express';
import { NammathamApp } from '../nammatham-app';

export abstract class BaseHandlerResolver {
  abstract resolveHandler(endpoint: NammamthamEndpoint, req: Request, res: Response): any
  abstract resolveRegisterHandler(app: NammathamApp): any
}
