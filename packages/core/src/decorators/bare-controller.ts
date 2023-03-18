import { Constructor } from '../interfaces';
import { controllerFactory } from './controller-factory';

export function BareController() {
  return (target: Constructor): void => controllerFactory(target);
}
