import { BaseHandlerResolver, NammathamApp } from '../runtimes';

export interface NammathamHttpHandlerOption {
  handlerResolver: BaseHandlerResolver;
  app: NammathamApp;
}
