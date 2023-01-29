export interface BaseFunctionBinding<T, N> {
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
  name: N;
}
