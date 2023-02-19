import { CustomFunctionBinding } from './custom-function-binding';
import {
  HttpTriggerBinding,
  HttpBinding,
  TimerTriggerBinding,
  CosmosDBTriggerBinding_v2,
  CosmosDBTriggerBinding_v4,
  CosmosDBBinding_v2,
  CosmosDBBinding_v4,
} from './triggers';

export type DefinedFunctionBinding<T extends unknown> =
  | HttpTriggerBinding<T>
  | HttpBinding<T>
  | TimerTriggerBinding<T>
  | CosmosDBTriggerBinding_v2<T>
  | CosmosDBTriggerBinding_v4<T>
  | CosmosDBBinding_v2<T>
  | CosmosDBBinding_v4<T>;

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
