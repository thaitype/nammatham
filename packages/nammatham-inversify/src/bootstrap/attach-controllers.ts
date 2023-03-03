import { Container } from 'inversify';
import {
  getAzureFunctionMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
  getControllersFromMetadata,
} from './utils';
import { TYPE } from '../contants';
import { AzureFunctionMethodMetadata } from '../interfaces';
import { Context } from '@azure/functions';

const config = {
  forceControllers: true, // throw if no controller assigned
};

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller);
    console.log('controllerMetadata', controllerMetadata);
    const constructor = controllerMetadata.target;

    container
      .bind(TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(controller.name);

    // Fake HttpContext is needed during registration, Ref: https://github.com/inversify/inversify-express-utils
    // Because Context's object will be passing during runtime by Azure Function
    // console.log(controller.name);
    // container
    //   .bind<Context>(TYPE.Context)
    //   .toConstantValue({} as Context)
    // .whenTargetNamed(controller.name);
  }

  console.log('test heyy');

  const _controllers = getControllersFromContainer(container, config.forceControllers);
  console.log('test heyy');

  const azureFunctions: AzureFunctionMethodMetadata[] = [];

  for (const controller of _controllers) {
    console.log(controller, controller.constructor, controller.name);

    const methodMetadata = getAzureFunctionMethodMetadata(controller.constructor);
    methodMetadata.forEach((metadata: AzureFunctionMethodMetadata) => {
      azureFunctions.push({
        ...metadata,
      });
    });
  }
  return azureFunctions;
}
