import type { Equal, Expect } from '@type-challenges/utils';
import { GetContextBindings } from './get-context-bindings';
import { ContextBindings, HttpRequest, HttpResponse, Timer } from '@azure/functions';
import { HttpBinding, TimerTriggerBinding, httpTriggerBinding } from '../interfaces';

const bindings = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  } as httpTriggerBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpBinding<'res'>,
  {
    name: 'timer',
    direction: 'in',
    type: 'timerTrigger',
  } as TimerTriggerBinding<'timer'>,
];

type ExpectedType = ContextBindings &
  // Expected map name with Azure Functions Type
  Record<'req', HttpRequest> &
  Record<'res', HttpResponse> &
  Record<'timer', Timer>;

type Cases = [
  // Test all cases
  Expect<Equal<GetContextBindings<typeof bindings>, ExpectedType>>
];
