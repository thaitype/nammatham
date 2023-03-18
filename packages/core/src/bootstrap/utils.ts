import { METADATA_KEY } from '../contants';
import {
  ControllerMethodMetadata,
  ControllerMetadata,
  ControllerParameterMetadata,
  Constructor,
} from '../interfaces';

export function getControllerMetadata(constructor: Constructor): ControllerMetadata {
  const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.controller,
    constructor
  ) as ControllerMetadata;
  return controllerMetadata;
}

export function getControllerMethodMetadata(constructor: Constructor): Array<ControllerMethodMetadata> {
  const methodMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.azureFunction,
    constructor
  ) as Array<ControllerMethodMetadata>;

  const genericMetadata = Reflect.getMetadata(
    METADATA_KEY.azureFunction,
    Reflect.getPrototypeOf(constructor) as Constructor
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
  constructor: Constructor,
): ControllerParameterMetadata {
  const parameterMetadata: ControllerParameterMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.controllerParameter,
    constructor,
  ) as ControllerParameterMetadata;

  const genericMetadata: ControllerParameterMetadata = Reflect.getMetadata(
    METADATA_KEY.controllerParameter,
    Reflect.getPrototypeOf(constructor) as Constructor,
  ) as ControllerParameterMetadata;

  if (genericMetadata !== undefined && parameterMetadata !== undefined) {
    return { ...parameterMetadata, ...genericMetadata };
  } if (genericMetadata !== undefined) {
    return genericMetadata;
  }
  return parameterMetadata;
}