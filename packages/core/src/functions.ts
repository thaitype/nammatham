import { FunctionTrigger } from './types';

export function createFunction(func: FunctionTrigger) {
  return () => {
    // TODO: Implement
    console.log(`createFunction: ${func.name}`);
  };
}
