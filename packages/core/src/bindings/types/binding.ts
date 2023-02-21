import { HttpTriggerType, HttpType, TimerTriggerType } from '../interfaces';
import { FunctionBinding } from '../interfaces/function-binding';
import { HttpRequest, HttpResponse, Timer } from '@azure/functions';

export type AllBindingTypes = FunctionBinding<unknown>['type'];

export type BindingType<T extends AllBindingTypes> = T extends HttpTriggerType
  ? HttpRequest
  : T extends TimerTriggerType
  ? Timer
  : T extends HttpType
  ? HttpResponse
  : unknown;

