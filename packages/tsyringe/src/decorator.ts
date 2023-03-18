import { injectable } from 'tsyringe';
import { core } from '@nammatham/core';

export function Controller() {
  return (target: core.Constructor): void =>
    core.controllerFactory(target, () => injectable()(target));
}
