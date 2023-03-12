import { BINDING_PARAMETER_TYPE } from '../contants';
import { bindingParamDecoratorFactory } from './binding-params-factory';
import { HttpTriggerOptions } from '@azure/functions';

export const httpTrigger: (option: HttpTriggerOptions) => ParameterDecorator = bindingParamDecoratorFactory(BINDING_PARAMETER_TYPE.HttpTrigger);
