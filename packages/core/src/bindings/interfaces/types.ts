import { FunctionBinding } from './function-binding';
import { HttpRequest, HttpResponse, Timer } from '@azure/functions';

export type AllBindingTypes = FunctionBinding<unknown>['type'];
/**
 * Only trigger with direction `in`
 */
export type AllBindingInputTypes = Exclude<AllBindingTypes, 'http'>;

export type Binding<T extends AllBindingTypes> = T extends 'httpTrigger'
  ? HttpRequest
  : T extends 'timerTrigger'
  ? Timer
  : T extends 'http'
  ? HttpResponse
  : any;

type TimeTrigger = Binding<'timerTrigger'>;
type HttpTrigger = Binding<'httpTrigger'>;
