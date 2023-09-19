import { Constructor, ControllerMethodMetadata, ParameterMetadata } from '../interfaces';
import { FunctionInput, FunctionOutput } from '@azure/functions';

export interface BootstrapControllerMethod {
  controller: Constructor;
  methodMetadataList: {
    method: ControllerMethodMetadata;
    params: ParameterMetadata[];
  }[];
}

export interface ParamsFunctionInput extends ParameterMetadata {
  config: FunctionInput;
}
export interface ParamsFunctionOutput extends ParameterMetadata {
  config: FunctionOutput;
}
export interface Extras {
  inputs: ParamsFunctionInput[];
  outputs: ParamsFunctionOutput[];
}

export type ObjectLike = Record<string, (...args: unknown[]) => unknown>;
