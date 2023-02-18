/**
 * Equivalent `BindingDefinition` in `@azure/functions@3.5.0`
 */

export interface BaseFunctionBinding<T, N> {
  /**
   * The type of your binding, as defined in function.json.
   */
  type: T;
  /**
   * The direction of your binding, as defined in function.json.
   */
  direction: 'in' | 'out' | 'inout' | undefined;
  /**
   * The name of your binding, as defined in function.json.
   */
  name: N;
}
