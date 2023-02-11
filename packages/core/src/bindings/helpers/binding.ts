import {CustomFunctionBinding, httpTriggerBinding, HttpBinding, TimerTriggerBinding } from '../interfaces';

export function custom<T extends CustomFunctionBinding<unknown>>(
  bindings: T
): CustomFunctionBinding<T['name']> {
  return bindings;
}

export function httpTrigger<T extends Omit<httpTriggerBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): httpTriggerBinding<T['name']> {
  return {
    ...bindings,
    type: 'httpTrigger',
    direction: 'in',
  };
}

export function http<T extends Omit<HttpBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): HttpBinding<T['name']> {
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
  httpTrigger,
  http,
  timeTrigger,
  custom,
};
