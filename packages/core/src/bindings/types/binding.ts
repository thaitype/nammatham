import { httpTriggerType, HttpType, TimerTriggerType } from '../interfaces';
import { FunctionBinding } from '../interfaces/function-binding';
import { HttpRequest, HttpResponse, Timer } from '@azure/functions';

export type AllBindingTypes = FunctionBinding<unknown>['type'];
/**
 * Only trigger with direction `in`
 */
export type AllBindingInputTypes = Exclude<AllBindingTypes, HttpType>;

export type BindingType<T extends AllBindingTypes> = T extends httpTriggerType
  ? HttpRequest
  : T extends TimerTriggerType
  ? Timer
  : T extends HttpType
  ? HttpResponse
  : any;

