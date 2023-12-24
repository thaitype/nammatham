import { FunctionTrigger } from './types';

export function createFunction(name: string, func: FunctionTrigger) {
  return () => {
    // TODO: Implement
    console.log(`createFunction: ${name}`);
  };
}
