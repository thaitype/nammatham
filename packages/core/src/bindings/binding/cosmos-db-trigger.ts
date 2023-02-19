import type { PartialBy } from '../../types';
import {
  CosmosDBTriggerBinding_v4,
  CosmosDBTriggerBinding_v2,
  CosmosDBBinding_v2,
  CosmosDBBinding_v4,
} from '../interfaces';

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v2 or v3. It requires to install [Bundle extension v2 or v3](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding input with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDBTrigger_v2({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDBTrigger_v2({ 
      name: 'documents' as const,
      direction: 'in',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "in",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `CosmosDBTriggerInputBinding_v2`
 * @returns `CosmosDBTriggerInputBinding_v2` Object with `{ type: 'cosmosDBTrigger', direction: 'in' }`
 */
export function cosmosDBTrigger_v2<
  T extends PartialBy<CosmosDBTriggerBinding_v2<unknown>, 'type' | 'direction'>
>(bindings: T): CosmosDBTriggerBinding_v2<T['name']> {
  return {
    ...bindings,
    type: 'cosmosDBTrigger',
    direction: 'in',
  };
}

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v4. It required to install [Bundle extension v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding input with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDBTrigger_v4({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDBTrigger_v4({ 
      name: 'documents' as const,
      direction: 'in',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "in",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `CosmosDBTriggerInputBinding_v4`
 * @returns `CosmosDBTriggerInputBinding_v4` Object with `{ type: 'cosmosDBTrigger', direction: 'in' }`
 */
export function cosmosDBTrigger_v4<
  T extends PartialBy<CosmosDBTriggerBinding_v4<unknown>, 'type' | 'direction'>
>(bindings: T): CosmosDBTriggerBinding_v4<T['name']> {
  return {
    ...bindings,
    type: 'cosmosDBTrigger',
    direction: 'in',
  };
}

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v4. It required to install [Bundle extension v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding input with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDBTrigger({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDBTrigger({ 
      name: 'documents' as const,
      direction: 'in',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "in",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `CosmosDBTriggerInputBinding_v4`
 * @returns `CosmosDBTriggerInputBinding_v4` Object with `{ type: 'cosmosDBTrigger', direction: 'in' }`
 */
export function cosmosDBTrigger<
  T extends PartialBy<CosmosDBTriggerBinding_v4<unknown>, 'type' | 'direction'>
>(bindings: T) {
  return cosmosDBTrigger_v4(bindings);
}

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v2 or v3. It requires to install [Bundle extension v2 or v3](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding output with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDB_v2({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDB_v2({ 
      name: 'documents' as const,
      direction: 'out',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "out",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `CosmosDBTriggerOutputBinding_v2`
 * @returns `CosmosDBTriggerOutputBinding_v2` Object with `{ type: 'cosmosDBTrigger', direction: 'out' }`
 */
export function cosmosDB_v2<
  T extends PartialBy<CosmosDBBinding_v2<unknown>, 'type' | 'direction'>
>(bindings: T): CosmosDBBinding_v2<T['name']> {
  return {
    ...bindings,
    type: 'cosmosDB',
    direction: 'out',
  };
}

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v4. It required to install [Bundle extension v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding output with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDB_v4({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDB_v4({ 
      name: 'documents' as const,
      direction: 'out',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "out",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
    @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

  * @param bindings - `CosmosDBTriggerOutputBinding_v4`
  * @returns `CosmosDBTriggerOutputBinding_v4` Object with `{ type: 'cosmosDBTrigger', direction: 'out' }`
  */
export function cosmosDB_v4<
  T extends PartialBy<CosmosDBBinding_v4<unknown>, 'type' | 'direction'>
>(bindings: T): CosmosDBBinding_v4<T['name']> {
  return {
    ...bindings,
    type: 'cosmosDB',
    direction: 'out',
  };
}

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v4. It required to install [Bundle extension v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding output with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDB({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDB({ 
      name: 'documents' as const,
      direction: 'out',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "out",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
    @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

  * @param bindings - `CosmosDBTriggerOutputBinding_v4`
  * @returns `CosmosDBTriggerOutputBinding_v4` Object with `{ type: 'cosmosDBTrigger', direction: 'out' }`
  */
export function cosmosDB<
  T extends PartialBy<CosmosDBBinding_v4<unknown>, 'type' | 'direction'>
>(bindings: T) {
  return cosmosDB_v4(bindings);
}
