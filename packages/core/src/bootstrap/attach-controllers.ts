import { Container } from 'inversify';
import * as utils from './utils';
import { TYPE } from '../contants';

/**
 * Related with inversify
 */

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    const controllerMetadata = utils.getControllerMetadata(controller);
    const constructor = controllerMetadata.target;

    container
      .bind(TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(controller.name);
  }

}