import { interfaces } from 'inversify';
import { METADATA_KEY, TYPE } from '../contants';
import {
  ControllerMethodMetadata,
  Controller,
  ControllerMetadata,
  DecoratorTarget,
  NO_CONTROLLERS_FOUND,
  ControllerParameterMetadata,
} from '../interfaces';

export function getControllersFromMetadata(): Array<DecoratorTarget> {
  const arrayOfControllerMetadata: Array<ControllerMetadata> =
    (Reflect.getMetadata(METADATA_KEY.controller, Reflect) as Array<ControllerMetadata>) || [];
  return arrayOfControllerMetadata.map(metadata => metadata.target);
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

export function getControllerMetadata(constructor: NewableFunction): ControllerMetadata {
  const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.controller,
    constructor
  ) as ControllerMetadata;
  return controllerMetadata;
}

export function getControllerMethodMetadata(constructor: NewableFunction): Array<ControllerMethodMetadata> {
  const methodMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.azureFunction,
    constructor
  ) as Array<ControllerMethodMetadata>;

  const genericMetadata = Reflect.getMetadata(
    METADATA_KEY.azureFunction,
    Reflect.getPrototypeOf(constructor) as NewableFunction
  ) as Array<ControllerMethodMetadata>;

  if (genericMetadata !== undefined && methodMetadata !== undefined) {
    return methodMetadata.concat(genericMetadata);
  }
  if (genericMetadata !== undefined) {
    return genericMetadata;
  }
  return methodMetadata;
}

export function getControllerParameterMetadata(
  constructor: NewableFunction,
): ControllerParameterMetadata {
  const parameterMetadata: ControllerParameterMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.controllerParameter,
    constructor,
  ) as ControllerParameterMetadata;

  const genericMetadata: ControllerParameterMetadata = Reflect.getMetadata(
    METADATA_KEY.controllerParameter,
    Reflect.getPrototypeOf(constructor) as NewableFunction,
  ) as ControllerParameterMetadata;

  if (genericMetadata !== undefined && parameterMetadata !== undefined) {
    return { ...parameterMetadata, ...genericMetadata };
  } if (genericMetadata !== undefined) {
    return genericMetadata;
  }
  return parameterMetadata;
}