import { CustomFunctionBinding, httpTriggerBinding, HttpBinding, TimerTriggerBinding } from '../interfaces';

function custom<T extends CustomFunctionBinding<unknown>>(bindings: T): CustomFunctionBinding<T['name']> {
  return bindings;
}

function httpTrigger<T extends Omit<httpTriggerBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): httpTriggerBinding<T['name']> {
  return {
    ...bindings,
    type: 'httpTrigger',
    direction: 'in',
  };
}

function http<T extends Omit<HttpBinding<unknown>, 'type' | 'direction'>>(bindings: T): HttpBinding<T['name']> {
  return {
    ...bindings,
    type: 'http',
    direction: 'out',
  };
}

function timeTrigger<T extends Omit<TimerTriggerBinding<unknown>, 'type' | 'direction'>>(
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
