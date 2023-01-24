import { CustomFunctionBinding } from './custom-function-binding';
import { HttpTriggerRequestBinding, HttpTriggerResponseBinding, TimerTriggerBinding } from './triggers';

export type DefinedFunctionBinding =
  | HttpTriggerRequestBinding
  | HttpTriggerResponseBinding
  | TimerTriggerBinding;

/**
 * If `T` type is `null`, then return `DefinedFunctionBinding`,
 * 
 * Otherwise, return `CustomFunctionBinding`.
 * 
 * Default Value of `T` is `null`, means return `DefinedFunctionBinding` by default
 */
export type FunctionBinding<T = null> = T extends null
   ? DefinedFunctionBinding
   : CustomFunctionBinding;

// function checkType<T>(){
  // const result: FunctionBinding<any> = {
  //   name: '',
  //   direction: 'out',
  //   type: 'http'
  // };
//   return result;
// }