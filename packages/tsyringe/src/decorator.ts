import { injectable } from 'tsyringe';
import { core } from '@nammatham/core';

export function controller() {
  return (target: NewableFunction): void => core.controllerFactory(target, () => injectable()(target as core.Constructor));
}

