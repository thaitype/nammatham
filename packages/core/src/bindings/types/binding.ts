import { extend } from 'lodash';
import {
  HttpTriggerContextBindingData,
  HttpTriggerType,
  HttpType,
  ServiceBusTriggerBinding,
  ServiceBusTriggerContextBindingData,
  ServiceBusTriggerType,
  TimerTriggerType,
} from '../interfaces';
import { FunctionBinding } from '../interfaces/function-binding';
import { ContextBindingData, HttpRequest, HttpResponse, Timer } from '@azure/functions';

export type AllBindingTypes = FunctionBinding<unknown>['type'];

export type BindingType<T extends AllBindingTypes> = T extends HttpTriggerType
  ? HttpRequest
  : T extends TimerTriggerType
  ? Timer
  : T extends HttpType
  ? HttpResponse
  : any;

export type ContextBindingType<T extends AllBindingTypes> = T extends ServiceBusTriggerType
  ? ServiceBusTriggerContextBindingData
  : T extends HttpTriggerType 
  ? HttpTriggerContextBindingData 
  : {};

/**
 * ContextBindingData with type
 * 
 * Note: Tricky Type Helper, Azure Functions allow only one 1 trigger type per function
 */
  
export type TypedContextBindingData<T extends readonly FunctionBinding<unknown>[]> = ContextBindingType<
  T[number]['type']
> &
  ContextBindingData;
