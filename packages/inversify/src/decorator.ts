import { injectable, decorate } from 'inversify';
import { core } from '@nammatham/core';

export function controller() {
  return (target: NewableFunction): void => core.controllerFactory(target, () => decorate(injectable(), target));
}

