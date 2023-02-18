import { CustomFunctionBinding } from './custom-function-binding';
import { HttpTriggerBinding, HttpBinding, TimerTriggerBinding, CosmosDBTriggerInputBinding_v2, CosmosDBTriggerInputBinding_v4 } from './triggers';

export type DefinedFunctionBinding<T extends unknown> =
  | HttpTriggerBinding<T>
  | HttpBinding<T>
  | TimerTriggerBinding<T>
  | CosmosDBTriggerInputBinding_v2<T>
  | CosmosDBTriggerInputBinding_v4<T>;

/**
 * If `T` type is `null`, then return `DefinedFunctionBinding`,
 *
 * Otherwise, return `CustomFunctionBinding`.
 *
 * Default Value of `T` is `null`, means return `DefinedFunctionBinding` by default
 */
export type FunctionBinding<N, T = null> = T extends null ? DefinedFunctionBinding<N> : CustomFunctionBinding<N>;

// function checkType<T>(){
// const result: FunctionBinding<any> = {
//   name: '',
//   direction: 'out',
//   type: 'http'
// };
//   return result;
// }
