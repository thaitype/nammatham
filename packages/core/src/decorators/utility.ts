import { PARAMETER_TYPE } from '../contants';
import { paramDecoratorFactory } from './params-factory';

export const Context: () => ParameterDecorator =
  paramDecoratorFactory(PARAMETER_TYPE.Context);