import { CustomFunctionBinding } from '../interfaces';

/**
 * Create custom type binding which Nammatham doesn't support yet.
 * 
 * @example
 *  ```
    Binding.custom({
      name: 'custom' as const,
      direction: 'in',
      type: 'custom'
    })
 *  ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "custom",
          "direction": "in",
          "type": "custom"
        }
      ]
    }
    ```
 * 
 * @param bindings - `CustomFunctionBinding` Object
 * @returns `CustomFunctionBinding` Object
 */
export function custom<T extends CustomFunctionBinding<unknown>>(bindings: T): CustomFunctionBinding<T['name']> {
  return bindings;
}
