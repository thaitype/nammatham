import type { UrlWithParsedQuery } from 'node:url';

import urlJoin from 'url-join';
import { magenta } from 'colorette';

import type { BaseHandlerResolver } from './bases';
import type { HttpMethod, ServerRequest, ServerResponse, NammamthamEndpoint } from './types';

import { logger } from './main';

export interface NammathamHttpOption {
  allowAllFunctionsAccessByHttp?: boolean;
}

export interface NammathamHttpHandlerOption {
  handlerResolver: BaseHandlerResolver;
  app: NammathamApp;
  option?: NammathamHttpOption;
}

interface NammathamAppRequestOption extends NammathamHttpHandlerOption {
  req: ServerRequest;
  res: ServerResponse;
}

function trimSlash(str: string) {
  return str.replace(/^\/|\/$/g, '');
}

function isMatchPath(path1: string, path2: string) {
  return trimSlash(path1).toLowerCase() === trimSlash(path2).toLowerCase();
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
  private _isDevelopment: boolean | undefined;

  constructor(public readonly handlerResolver: BaseHandlerResolver) {}

  /**
   * Start register functions on the runtime e.g. Azure Functions
   */

  async start() {
    logger.debug('Registering functions...');
    await this.handlerResolver.resolveRegisterHandler(this);
    logger.debug('All functions registered');
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
    logger.debug(`Function "${func.name}" added`);
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

  getRequestHandler() {
    return async (req: ServerRequest, res: ServerResponse, query: UrlWithParsedQuery) => {
      logger.info(`Handling request for ${req.url}`);

      // FIXME: Consider to use express plugin in development mode only, match incoming path is lack of performance
      for (const func of this.functions) {
        if (func.endpointOption?.type === 'http') {
          if (!func.endpointOption.methods?.includes(req.method as HttpMethod)) {
            /**
             * Azure Functions will return 404 if the method is not matched.
             */
            return res.end(404);
          }
          if (isMatchPath(urlJoin(this.handlerResolver.prefixPath, func.endpointOption.route), query.path ?? '')) {
            return await this.handlerResolver.resolveHandler(func, req, res);
          }
        }
      }
      return res.writeHead(404).end(`Path not found: ${query.path}`);
    };
  }

  config({ dev, hostname, port }: { dev: boolean; hostname: string; port: number }) {
    this.setDevelopment(dev);
    return this;
  }

  useServer(server: any) {
    return this;
  }
}
