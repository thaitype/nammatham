import {CustomFunctionBinding, HttpTriggerRequestBinding, HttpTriggerResponseBinding, TimerTriggerBinding } from '../interfaces';

export function custom<T extends CustomFunctionBinding<unknown>>(
  bindings: T
): CustomFunctionBinding<T['name']> {
  return bindings;
}

export function httpTriggerRequest<T extends Omit<HttpTriggerRequestBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): HttpTriggerRequestBinding<T['name']> {
  return {
    ...bindings,
    type: 'httpTrigger',
    direction: 'in',
  };
}

export function httpTriggerResponse<T extends Omit<HttpTriggerResponseBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): HttpTriggerResponseBinding<T['name']> {
  return {
    ...bindings,
    type: 'http',
    direction: 'out',
  };
}

export function timeTrigger<T extends Omit<TimerTriggerBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): TimerTriggerBinding<T['name']> {
  return {
    ...bindings,
    type: 'timerTrigger',
    direction: 'in',
  };
}

export default {
  httpTriggerRequest,
  httpTriggerResponse,
  timeTrigger,
  custom,
};
