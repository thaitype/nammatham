import { BaseHandlerResolver, NammathamApp } from '../core';

export interface NammathamHttpHandlerOption {
  handlerResolver: BaseHandlerResolver;
  app: NammathamApp;
}
