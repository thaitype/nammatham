import { Container } from "inversify";
import {
  getAzureFunctionMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
  getControllersFromMetadata,
} from "./utils";
import { TYPE } from "../contants";
import { AzureFunctionMethodMetadata } from "../interfaces";
import { Context } from "@azure/functions";

const config = {
  forceControllers: true, // throw if no controller assigned
};

export function attachControllers(container: Container) {
  console.log("Getting Metadata from method");
  const constructors = getControllersFromMetadata();

  constructors.forEach((constructor) => {
    const { name } = constructor as { name: string };

    console.log(name);
    container
      .bind(TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(name);

    // Fake HttpContext is needed during registration, Ref: https://github.com/inversify/inversify-express-utils
    // Because Context's object will be passing during runtime by Azure Function 
    container
      .bind<Context>(TYPE.Context)
      .toConstantValue({} as Context)
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
