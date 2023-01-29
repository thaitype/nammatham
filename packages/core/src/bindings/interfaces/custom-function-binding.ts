import { BaseFunctionBinding } from "./base-function-binding";

/**
 * Custom Function Binding can assign any type value
 */
export interface CustomFunctionBinding extends BaseFunctionBinding<string>, Record<string, any> {
  type: string;
}
