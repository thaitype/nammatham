import { ControllerMethodMetadata, ParameterMetadata } from '../interfaces';

export interface BootstrapControllerMethod {
  controller: NewableFunction;
  methodMetadataList: {
    method: ControllerMethodMetadata;
    params: ParameterMetadata[];
  }[];
}
