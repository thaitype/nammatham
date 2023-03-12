import { controllerFactory } from './controller-factory';

export function bareController() {
  return (target: NewableFunction): void => controllerFactory(target);
}
