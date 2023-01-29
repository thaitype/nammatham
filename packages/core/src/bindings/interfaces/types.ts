import { FunctionBinding } from './function-binding';
import { HttpRequest, Timer } from '@azure/functions';

export type AllBindingTypes = FunctionBinding['type'];
/**
 * Only trigger with direction `in`
 */
export type AllBindingInputTypes = Exclude<AllBindingTypes, 'http'>;

export type Binding<T extends AllBindingInputTypes> = T extends 'httpTrigger'
  ? HttpRequest
  : T extends 'timerTrigger'
  ? Timer
  : any;

type TimeTrigger = Binding<'timerTrigger'>;
type HttpTrigger = Binding<'httpTrigger'>;
