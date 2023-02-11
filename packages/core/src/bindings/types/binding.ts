import { HttpTriggerRequestType, HttpTriggerResponseType, TimerTriggerType } from '../interfaces';
import { FunctionBinding } from '../interfaces/function-binding';
import { HttpRequest, HttpResponse, Timer } from '@azure/functions';

export type AllBindingTypes = FunctionBinding<unknown>['type'];
/**
 * Only trigger with direction `in`
 */
export type AllBindingInputTypes = Exclude<AllBindingTypes, HttpTriggerResponseType>;

export type BindingType<T extends AllBindingTypes> = T extends HttpTriggerRequestType
  ? HttpRequest
  : T extends TimerTriggerType
  ? Timer
  : T extends HttpTriggerResponseType
  ? HttpResponse
  : any;

type TimeTrigger = BindingType<'timerTrigger'>;
type HttpTrigger = BindingType<'httpTrigger'>;
