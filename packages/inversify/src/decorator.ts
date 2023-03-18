import { injectable, decorate } from 'inversify';
import { core } from '@nammatham/core';

export function controller() {
  return (target: core.Constructor): void => core.controllerFactory(target, () => decorate(injectable(), target));
}

