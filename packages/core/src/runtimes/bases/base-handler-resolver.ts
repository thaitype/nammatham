import { NammamthamEndpoint } from '../types';

export abstract class BaseHandlerResolver {
  abstract resolveHandler(endpoint: NammamthamEndpoint): any;
}
