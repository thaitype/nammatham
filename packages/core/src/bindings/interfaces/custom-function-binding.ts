import { BaseFunctionBinding } from './base-function-binding';

/**
 * Custom Function Binding can assign any type value
 */
export interface CustomFunctionBinding<T> extends BaseFunctionBinding<string, T>, Record<string, any> {
  type: string;
}
