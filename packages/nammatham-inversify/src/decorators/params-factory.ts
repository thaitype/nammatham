import { METADATA_KEY, PARAMETER_TYPE } from '../contants';
import { Controller, ControllerParameterMetadata, ParameterMetadata } from '../interfaces';

export function paramDecoratorFactory(parameterType: PARAMETER_TYPE): (name?: string) => ParameterDecorator {
  return (name?: string): ParameterDecorator => params(parameterType, name);
}

export function params(type: PARAMETER_TYPE, parameterName?: string) {
  return (target: unknown | Controller, methodName: string | symbol, index: number): void => {
    let metadataList: ControllerParameterMetadata = {};
    let parameterMetadataList: Array<ParameterMetadata> = [];
    const parameterMetadata: ParameterMetadata = {
      index,
      injectRoot: parameterName === undefined,
      parameterName,
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
