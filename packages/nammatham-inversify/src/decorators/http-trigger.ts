import { PARAMETER_TYPE } from '../contants';
import { HttpTriggerOptions } from '@azure/functions';
import { paramDecoratorFactory } from './params-factory';

export const httpTrigger: (option: HttpTriggerOptions) => ParameterDecorator = paramDecoratorFactory(
  PARAMETER_TYPE.HttpTrigger
);
