import { Constructor, ControllerMethodMetadata, ParameterMetadata } from '../interfaces';

export interface BootstrapControllerMethod {
  controller: Constructor;
  methodMetadataList: {
    method: ControllerMethodMetadata;
    params: ParameterMetadata[];
  }[];
}
