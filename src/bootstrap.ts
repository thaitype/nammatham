import { Container } from "inversify";
import {
  getAzureFunctionMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
  getControllersFromMetadata,
} from "./utils";
import { TYPE } from "./contants";
import { AzureFunctionMethodMetadata } from "./interfaces";

const config = {
  forceControllers: true, // throw if no controller assigned
};

export function funcBootstrap(container: Container, classTarget: NewableFunction, methodName: string) {
  const azureFunctions = bootstrap(container);
  for(const func of azureFunctions){
    console.log(func.key, func.name, (func.target as { constructor: NewableFunction }).constructor);
  }
  let controllerInstance = container.getNamed(TYPE.Controller, classTarget.name);
  (controllerInstance as any)[methodName]();
  console.log("funcBootstrap");
}

export function bootstrap(container: Container) {
  console.log("Getting Metadata from method");
  const constructors = getControllersFromMetadata();

  constructors.forEach((constructor) => {
    const { name } = constructor as { name: string };

    console.log(name)
    container
      .bind(TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(name);
  });

  const controllers = getControllersFromContainer(
    container,
    config.forceControllers
  );

  const azureFunctions: AzureFunctionMethodMetadata[] = [];

  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller.constructor);
    const methodMetadata = getAzureFunctionMethodMetadata(
      controller.constructor
    );
    console.log(controllerMetadata, methodMetadata);
    methodMetadata.forEach((metadata: AzureFunctionMethodMetadata) => {
      console.log(metadata.target.constructor);
      azureFunctions.push({
        ...metadata,
      });
    });
  }
  return azureFunctions;
}