import { BlobTriggerBinding } from 'packages/core/dist/main';
import { CustomFunctionBinding } from './custom-function-binding';
import {
  HttpTriggerBinding,
  HttpBinding,
  TimerTriggerBinding,
  CosmosDBTriggerBinding_V2,
  CosmosDBTriggerBinding_V4,
  CosmosDBBinding_Output_V2,
  CosmosDBBinding_Output_V4,
  CosmosDBBinding_Input_V2,
  CosmosDBBinding_Input_V4,
  BlobBinding_Input,
  BlobBinding_Output
} from './triggers';

export type DefinedFunctionBinding<T extends unknown> =
  | HttpTriggerBinding<T>
  | HttpBinding<T>
  | TimerTriggerBinding<T>
  | CosmosDBTriggerBinding_V2<T>
  | CosmosDBTriggerBinding_V4<T>
  | CosmosDBBinding_Output_V2<T>
  | CosmosDBBinding_Output_V4<T>
  | CosmosDBBinding_Input_V2<T>
  | CosmosDBBinding_Input_V4<T>
  | BlobTriggerBinding<T>
  | BlobBinding_Input<T>
  | BlobBinding_Output<T>



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
