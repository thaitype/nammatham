import { logger } from '../core';
import { BaseHandlerResolver } from './bases';
import { NammamthamEndpoint } from './types';

export class NammathamApp {
  protected readonly _functions: NammamthamEndpoint[] = [];

  constructor(protected handlerResolver: BaseHandlerResolver) {
    
  }

  /**
   * Start register functions on the runtime e.g. Azure Functions
   */

  start() {
    logger.info(`Start Nammatham, Type-safe Serverless Framework`);
    logger.debug('Registering functions...');
    this.handlerResolver.resolveRegisterHandler(this);
    logger.info('All functions registered');
  }

  addFunctions(...functions: NammamthamEndpoint[]) {
    for (const func of functions) {
      this.addFunction(func);
    }
  }

  addFunction(func: NammamthamEndpoint) {
    logger.debug(`Adding function "${func.name}" on route: ${func.endpointOption?.route}`);
    this._functions.push(func);
  }

  use<TReturn>(middleware: (app: NammathamApp, handlerResolver: BaseHandlerResolver) => TReturn) {
    logger.debug('Using middleware on the app...');
    middleware(this, this.handlerResolver);
  }

  get functions() {
    return this._functions;
  }
}
