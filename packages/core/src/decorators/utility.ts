import { PARAMETER_TYPE } from '../contants';
import { ControllerMethodMetadata, ControllerMetadata, DecoratorTarget, HandlerDecorator } from '../interfaces';
import { paramDecoratorFactory } from './params-factory';

// export const log: () => ParameterDecorator =
//   paramDecoratorFactory(PARAMETER_TYPE.Logger);

export const Context: () => ParameterDecorator =
  paramDecoratorFactory(PARAMETER_TYPE.Context);