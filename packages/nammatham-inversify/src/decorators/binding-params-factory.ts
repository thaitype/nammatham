import { METADATA_KEY, BINDING_PARAMETER_TYPE } from '../contants';
import { Controller, ControllerParameterMetadata, ParameterMetadata } from '../interfaces';

export function bindingParamDecoratorFactory<T>(
  parameterType: BINDING_PARAMETER_TYPE
): (option?: T) => ParameterDecorator {
  return (option?: T): ParameterDecorator => bindingParams<T>(parameterType, option);
}

export function bindingParams<T>(type: BINDING_PARAMETER_TYPE, option?: T) {
  return (target: unknown | Controller, methodName: string | symbol, index: number): void => {
    console.error(`bindingParams: Not implemented yet (Using type =  ${type}) with option: ${JSON.stringify(option)} [target=${JSON.stringify(target)}, methodName=${methodName.toString()}, index=${index}]`);
  };
}
