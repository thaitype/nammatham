export type BindingType = 'httpTrigger' | 'http' | 'timerTrigger';
export type BindingDiection = 'in' | 'out';

export interface BaseFunctionBinding<T> {
  /**
   * Binding Type
   * 
   * Required
   */
  type: T;
  /**
   * Binding Direction
   * 
   * Required
   */
  direction: 'in' | 'out';
  /**
   * Binding Name
   * 
   * Required - the variable name used in function code for the request or request body.
   */
  name: string;
}
