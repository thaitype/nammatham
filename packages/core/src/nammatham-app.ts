import { bgBlue, blue } from 'colorette';

import type { NammamthamEndpoint } from './types';
import type { BaseHandler, BaseHandlerResolver } from './bases';

import { logger } from './main';

export async function logo() {
  return `${bgBlue(`\n nammatham `)} ${blue('v' + (await import('../package.json')).version)}`;
}

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
  private _isDevelopment = false;
  public readonly startTime = performance.now();

  constructor(public readonly handlerResolver: BaseHandlerResolver) {}

  /**
   * Start register functions on the runtime e.g. Azure Functions
   */

  async start() {
    logger.debug('Registering functions...');
    await this.handlerResolver.resolveRegisterHandler(this);
    logger.debug('All functions registered');
    console.log(`${await logo()} \n`);
  }

  addEndpoint(func: NammamthamEndpoint) {
    logger.debug(`Adding function "${func.name}" on route: ${func.endpointOption?.route}`);
    this._functions.push(func);
    logger.debug(`Function "${func.name}" added`);
    return this;
  }

  addEndpoints(...functions: NammamthamEndpoint[]) {
    for (const func of functions) {
      this.addEndpoint(func);
    }
    return this;
  }

  addFunctions(...functions: BaseHandler<any>[]) {
    for (const func of functions) {
      this.addFunction(func);
    }
    return this;
  }

  addFunction(handler: BaseHandler<any>) {
    const func = handler.build();
    this.addEndpoint(func);
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
