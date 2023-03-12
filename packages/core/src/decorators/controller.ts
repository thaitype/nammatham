import { injectable, decorate } from 'inversify';
import { controllerFactory } from './controller-factory';

export function controller() {
  return (target: NewableFunction): void => controllerFactory(target, () => decorate(injectable(), target));
}

