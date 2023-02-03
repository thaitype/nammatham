import { Container } from 'inversify';
import {
  getAzureFunctionMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
} from './decorator-utils';
import { TYPE } from '../contants';
import { AzureFunctionMethodMetadata } from '../interfaces';

const config = {
  forceControllers: true, // throw if no controller assigned
};

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  console.log(controllers.length)
  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller);
    console.log('controllerMetadata', controllerMetadata);
    if(!controllerMetadata){
      console.warn('controllerMetadata is undefined');
      continue;
    }
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
}


export function resolveAllAzureFunctions(container: Container){
  const _controllers = getControllersFromContainer(container, config.forceControllers);

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