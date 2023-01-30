import { BaseFunctionBinding } from './base-function-binding';

export interface AzureFunctionJsonConfig {
  bindings: BaseFunctionBinding<unknown, string>[];
  scriptFile?: string;
}
