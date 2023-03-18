import { PARAMETER_TYPE } from '../contants';
import { HttpTriggerOptions } from '@azure/functions';
import { paramDecoratorFactory } from './params-factory';

export const HttpTrigger: (option: HttpTriggerOptions) => ParameterDecorator = paramDecoratorFactory(
  PARAMETER_TYPE.HttpTrigger
);

export const Res: () => ParameterDecorator = paramDecoratorFactory(
  PARAMETER_TYPE.Response
);
