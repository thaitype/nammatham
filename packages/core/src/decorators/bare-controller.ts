import { Constructor } from '../interfaces';
import { controllerFactory } from './controller-factory';

export function bareController() {
  return (target: Constructor): void => controllerFactory(target);
}
