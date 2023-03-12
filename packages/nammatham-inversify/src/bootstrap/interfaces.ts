import { ControllerMethodMetadata, ParameterMetadata } from "../interfaces";

export interface BootstrapControllerMethod {
    method: ControllerMethodMetadata;
    params: ParameterMetadata[];
  }