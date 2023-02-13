import type { PartialBy }  from '../../types';
import { CustomFunctionBinding, httpTriggerBinding, HttpBinding, TimerTriggerBinding } from '../interfaces';

function custom<T extends CustomFunctionBinding<unknown>>(bindings: T): CustomFunctionBinding<T['name']> {
  return bindings;
}

function httpTrigger<T extends PartialBy<httpTriggerBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): httpTriggerBinding<T['name']> {
  return {
    ...bindings,
    type: 'httpTrigger',
    direction: 'in',
  };
}


function http<T extends PartialBy<HttpBinding<unknown>, 'type' | 'direction'>>(bindings: T): HttpBinding<T['name']> {
  return {
    ...bindings,
    type: 'http',
    direction: 'out',
  };
}

function timerTrigger<T extends PartialBy<TimerTriggerBinding<unknown>, 'type' | 'direction'>>(
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
  timerTrigger,
  custom,
};
