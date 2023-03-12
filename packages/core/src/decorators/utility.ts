import { PARAMETER_TYPE } from '../contants';
import { ControllerMethodMetadata, ControllerMetadata, DecoratorTarget, HandlerDecorator } from '../interfaces';
import { paramDecoratorFactory } from './params-factory';

export const logger: () => ParameterDecorator =
  paramDecoratorFactory(PARAMETER_TYPE.Logger);

export const context: () => ParameterDecorator =
  paramDecoratorFactory(PARAMETER_TYPE.Context);