import { yellow } from 'colorette';

import type { NammathamApp } from './nammatham-app';
import type { BaseRuntimeAdapter } from './bases/base-runtime-adapter';

import { logger } from './main';
import { DefaultAdapter } from './default-adapter';

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

export const createInitNammatham = <Adapter extends BaseRuntimeAdapter<unknown>>(defaultAdapter: Adapter) => ({
  create(adapter?: Adapter): NammathamRuntime<Adapter> {
    logger.debug(`Using adapter: ${yellow(adapter?.constructor.name ?? defaultAdapter?.constructor.name)}`);
    if (adapter === undefined) {
      return createRuntime<Adapter>(defaultAdapter as any);
    }
    return createRuntime<Adapter>(adapter);
  },
});

export const initNammatham = createInitNammatham(new DefaultAdapter());
