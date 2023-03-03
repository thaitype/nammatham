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
  /**
   * true if want to ignore the first argument injection with `ContextBindings`,
   * false if first argument injected with `ContextBindings`
   * 
   * this option will be removed before generate `function.json`
   * 
   * Added in: Add utility `GetContextBindings` for extracting type from FunctionBinding 
   * Pull Request #28
   */
  useHelper?: boolean;
}
