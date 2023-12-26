import { BaseRuntimeAdapter } from './bases/base-runtime-adapter';
import { DefaultAdapter } from './adapters/default';
import { NammathamApp } from './nammatham-app';
import { log } from 'console';
import { logger } from '../core';
import { yellow } from 'colorette';

export interface NammathamRuntime<Adapter extends BaseRuntimeAdapter<unknown>> {
  func: ReturnType<Adapter['createTrigger']>;
  app: NammathamApp;
}

function createRuntime<Adapter extends BaseRuntimeAdapter<unknown>>(adapter?: Adapter): NammathamRuntime<Adapter> {
  if (adapter === undefined) throw new Error(`Cannot create NammathamRuntime without adapter`);
  return {
    func: adapter.createTrigger(),
    app: adapter.createApp(),
  } as unknown as NammathamRuntime<Adapter>;
}

export const initNammatham = {
  create<Adapter extends BaseRuntimeAdapter<unknown> = DefaultAdapter>(adapter?: Adapter): NammathamRuntime<Adapter> {
    logger.info(`Using adapter: ${yellow(adapter?.constructor.name ?? 'DefaultAdapter')}`);
    if (adapter === undefined) {
      return createRuntime<Adapter>(new DefaultAdapter() as any);
    }
    return createRuntime<Adapter>(adapter);
  },
};
