import { magenta } from 'colorette';
import { logger } from './main';
import { BaseHandlerResolver } from './bases';
import { NammamthamEndpoint } from './types';

export class NammathamApp {
  protected readonly _functions: NammamthamEndpoint[] = [];

  constructor(protected handlerResolver: BaseHandlerResolver) {
    console.log(magenta(`\nStart Nammatham, Type-safe Serverless Framework\n`));
  }

  /**
   * Start register functions on the runtime e.g. Azure Functions
   */

  async start() {
    logger.debug('Registering functions...');
    await this.handlerResolver.resolveRegisterHandler(this);
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
    logger.info(`Function "${func.name}" added`);
  }

  use<TReturn>(middleware: (app: NammathamApp, handlerResolver: BaseHandlerResolver) => TReturn) {
    middleware(this, this.handlerResolver);
  }

  get functions() {
    return this._functions;
  }
}
