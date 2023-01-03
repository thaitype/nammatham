import { interfaces } from "inversify";
import { METADATA_KEY, TYPE } from "./contants";
import {
  AzureFunctionMethodMetadata,
  Controller,
  ControllerMetadata,
  DecoratorTarget,
  NO_CONTROLLERS_FOUND,
} from "./interfaces";

export function getControllersFromMetadata(): Array<DecoratorTarget> {
  const arrayOfControllerMetadata: Array<ControllerMetadata> =
    (Reflect.getMetadata(
      METADATA_KEY.controller,
      Reflect
    ) as Array<ControllerMetadata>) || [];
  return arrayOfControllerMetadata.map((metadata) => metadata.target);
}

export function getControllersFromContainer(
  container: interfaces.Container,
  forceControllers: boolean
): Array<Controller> {
  if (container.isBound(TYPE.Controller)) {
    return container.getAll<Controller>(TYPE.Controller);
  }
  if (forceControllers) {
    throw new Error(NO_CONTROLLERS_FOUND);
  } else {
    return [];
  }
}

export function getControllerMetadata(
  constructor: NewableFunction
): ControllerMetadata {
  const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.controller,
    constructor
  ) as ControllerMetadata;
  return controllerMetadata;
}

export function getAzureFunctionMethodMetadata(
  constructor: NewableFunction
): Array<AzureFunctionMethodMetadata> {
  const methodMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.azureFunction,
    constructor
  ) as Array<AzureFunctionMethodMetadata>;

  const genericMetadata = Reflect.getMetadata(
    METADATA_KEY.azureFunction,
    Reflect.getPrototypeOf(constructor) as NewableFunction
  ) as Array<AzureFunctionMethodMetadata>;

  if (genericMetadata !== undefined && methodMetadata !== undefined) {
    return methodMetadata.concat(genericMetadata);
  }
  if (genericMetadata !== undefined) {
    return genericMetadata;
  }
  return methodMetadata;
}
