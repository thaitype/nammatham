
import { METADATA_KEY, PARAMETER_TYPE } from '../contants';
import { Controller, ControllerParameterMetadata, ParameterMetadata } from '../interfaces';

export function paramDecoratorFactory<Option>(parameterType: PARAMETER_TYPE): (option?: Option) => ParameterDecorator {
  return (option?: Option): ParameterDecorator => params(parameterType, option) as ParameterDecorator ;
}

/**
 *
 * Original : https://github.com/inversify/inversify-express-utils
 */

export function params<Option>(type: PARAMETER_TYPE, option?: Option) {
  return (target: unknown | Controller, methodName: string | symbol, index: number): void => {
    let metadataList: ControllerParameterMetadata = {};
    let parameterMetadataList: Array<ParameterMetadata<Option>> = [];
    const parameterMetadata: ParameterMetadata<Option> = {
      index,
      option,
      type,
    };
    if (!Reflect.hasOwnMetadata(METADATA_KEY.controllerParameter, (target as Controller).constructor)) {
      parameterMetadataList.unshift(parameterMetadata);
    } else {
      metadataList = Reflect.getOwnMetadata(
        METADATA_KEY.controllerParameter,
        (target as Controller).constructor
      ) as ControllerParameterMetadata;
      if (metadataList[methodName as string]) {
        parameterMetadataList = metadataList[methodName as string] || [];
      }
      parameterMetadataList.unshift(parameterMetadata);
    }
    metadataList[methodName as string] = parameterMetadataList;
    Reflect.defineMetadata(METADATA_KEY.controllerParameter, metadataList, (target as Controller).constructor);
  };
}
