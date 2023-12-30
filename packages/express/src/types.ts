import { BaseHandlerResolver, NammathamApp } from '@nammatham/core';

export interface NammathamHttpHandlerOption {
  handlerResolver: BaseHandlerResolver;
  app: NammathamApp;
}
