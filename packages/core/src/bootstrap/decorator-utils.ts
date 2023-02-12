import { METADATA_KEY } from '../contants';
import {
  ControllerMetadata,
} from '../interfaces';


export function getControllerMetadata(constructor: NewableFunction): ControllerMetadata {
  const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(
    METADATA_KEY.controller,
    constructor
  ) as ControllerMetadata;
  return controllerMetadata;
}
