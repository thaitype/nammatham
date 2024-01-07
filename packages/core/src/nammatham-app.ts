import { magenta } from 'colorette';
import { logger } from './main';
import { BaseHandlerResolver } from './bases';
import { NammamthamEndpoint } from './types';

export class NammathamApp {
  protected readonly _functions: NammamthamEndpoint[] = [];
  /**
   * The runtime server e.g. Azure Functions,
   * this is used to determine whether to start the server or not.
   */
  private runtimeServer: string | undefined;
  /**
   * Use when run app in development mode or not,
   * Mostly used for plugins, e.g. expressPlugin
   * 
   * For example, expressPlugin will not start express server in production mode for Azure Functions Adapter,
   * because Azure Functions will start the server for us.
   */
  private _isDevelopment: boolean | undefined;

  constructor(public readonly handlerResolver: BaseHandlerResolver) {}

  /**
   * Start register functions on the runtime e.g. Azure Functions
   */

  async start() {
    logger.debug('Registering functions...');
    await this.handlerResolver.resolveRegisterHandler(this);
    logger.info('All functions registered');
    console.log(magenta(`\nStart Nammatham, Type-safe Serverless Library\n`));
  }

  addFunctions(...functions: NammamthamEndpoint[]) {
    for (const func of functions) {
      this.addFunction(func);
    }
    return this;
  }

  addFunction(func: NammamthamEndpoint) {
    logger.debug(`Adding function "${func.name}" on route: ${func.endpointOption?.route}`);
    this._functions.push(func);
    logger.info(`Function "${func.name}" added`);
    return this;
  }

  register<TReturn>(middleware: (app: NammathamApp, handlerResolver: BaseHandlerResolver) => TReturn) {
    middleware(this, this.handlerResolver);
  }

  get functions() {
    return this._functions;
  }

  get runtime() {
    return this.runtimeServer;
  }

  setRuntime(runtime: string) {
    this.runtimeServer = runtime;
  }

  get isDevelopment() {
    return this._isDevelopment;
  }

  setDevelopment(isDev: boolean) {
    this._isDevelopment = isDev;
  }
  
}
