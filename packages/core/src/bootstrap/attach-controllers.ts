import { Container } from 'inversify';
import {
  getAzureFunctionMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
} from './utils';
import { TYPE } from '../contants';
import { ControllerMetadata } from '../interfaces';
// import { AzureFunctionMethodMetadata } from '../interfaces';

const config = {
  forceControllers: true, // throw if no controller assigned
};

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller);
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
    // container
    //   .bind<Context>(TYPE.Context)
    //   .toConstantValue({} as Context)
    // .whenTargetNamed(controller.name);
  }
}


export function resolveAllAzureFunctions(container: Container, controllers: NewableFunction[]){
  const azureFunctions: ControllerMetadata[] = [];
  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller);
    azureFunctions.push(controllerMetadata);
  }
  // const _controllers = getControllersFromContainer(container, config.forceControllers);

  // const azureFunctions: AzureFunctionMethodMetadata[] = [];

  // for (const controller of _controllers) {
  //   console.log(controller, controller.constructor, controller.name);

  //   const methodMetadata = getAzureFunctionMethodMetadata(controller.constructor);
  //   methodMetadata.forEach((metadata: AzureFunctionMethodMetadata) => {
  //     azureFunctions.push({
  //       ...metadata,
  //     });
  //   });
  // }
  return azureFunctions;
}