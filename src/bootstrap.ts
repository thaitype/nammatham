import { Container } from "inversify";
import {
  getAzureFunctionMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
  getControllersFromMetadata,
} from "./utils";
import { TYPE } from "./contants";

const config = {
  forceControllers: true, // throw if no controller assigned
};

export function bootstrap(container: Container) {
  console.log("Getting Metadata from method");
  // for(const metadata of getControllersFromMetadata()){
  //     console.log(metadata);
  // }
  const constructors = getControllersFromMetadata();

  constructors.forEach((constructor) => {
    const { name } = constructor as { name: string };

    container
      .bind(TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(name);
  });

  const controllers = getControllersFromContainer(
    container,
    config.forceControllers
  );

  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller.constructor);
    const methodMetadata = getAzureFunctionMethodMetadata(
      controller.constructor
    );
    console.log(controllerMetadata, methodMetadata);
  }
}
