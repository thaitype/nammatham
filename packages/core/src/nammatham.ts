import type { Env, Hono, Schema } from 'hono';
import type { serve } from '@hono/node-server';

import invariant from 'tiny-invariant';
import { bgBlue, blue } from 'colorette';
import { AzureFunctionsTrigger } from '@nammatham/azure-functions';

import type { BaseHandler } from './bases';
import type { NammamthamEndpoint } from './types';

import { logger } from './main';

async function logo() {
  return `${bgBlue(`\n nammatham `)} ${blue('v' + (await import('../package.json')).version)}`;
}

interface NammathamOptions {
  dev?: boolean;
  port?: number;
}

export class Nammatham {
  protected readonly _functions: NammamthamEndpoint[] = [];
  private serveFunction!: typeof serve;

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

  constructor(public readonly options: NammathamOptions) {}

  /**
   * Start register functions on the runtime e.g. Azure Functions
   */

  async start() {
    logger.debug('Registering functions...');
    // await this.handlerResolver.resolveRegisterHandler(this);
    logger.debug('All functions registered');
    console.log(`${await logo()} \n`);
  }

  createFunction() {
    return new AzureFunctionsTrigger();
  }

  useNodeServer(serveFunction: typeof serve) {
    if (this.options.dev === true) {
      this.runtimeServer = 'node';
      logger.debug('Using Node.js server');
      this.serveFunction = serveFunction;
    }
    return this;
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

  // eslint-disable-next-line @typescript-eslint/ban-types
  handle<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'>(app?: Hono<E, S, BasePath>) {
    if (this.options.dev === true) {
      return this.handleDevServer(app);
    }
    
    return app;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  private handleDevServer<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'>(
    app?: Hono<E, S, BasePath>
  ) {
    invariant(this.serveFunction, 'serveFunction is not defined');
    if (app === undefined) {
      throw new Error('app is required');
    }
    return this.serveFunction({
      fetch: app.fetch,
      port: this.options.port,
    });
  }
}
