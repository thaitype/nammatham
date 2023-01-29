import { FunctionBinding } from './function-binding';

export interface AzureFunctionJsonConfig {
  bindings: FunctionBinding[];
  scriptFile?: string;
}
