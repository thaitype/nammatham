import type { Equal, Expect } from '@type-challenges/utils';
import {
  GetBindings,
  GetOnlyInputBindings,
  GetOnlyReturnBindings,
  GetOnlyOutputBindings,
} from './get-context-bindings';
import { ContextBindings, HttpRequest, HttpResponse, Timer } from '@azure/functions';
import { HttpBinding, TimerTriggerBinding, HttpTriggerBinding } from '../interfaces';

const bindings = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  } as HttpTriggerBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpBinding<'res'>,
  {
    name: '$return',
    direction: 'out',
    type: 'http',
  } as HttpBinding<'$return'>,
  {
    name: 'timer',
    direction: 'in',
    type: 'timerTrigger',
  } as TimerTriggerBinding<'timer'>,
] as const;

type ExpectedType_AllBindings = ContextBindings &
  // Expected map name with Azure Functions Type
  Record<'req', HttpRequest> &
  Record<'res', HttpResponse> &
  Record<'$return', HttpResponse> & // Duplicate type still work!
  Record<'timer', Timer>;

type ExpectedType_OnlyInputBindings = ContextBindings &
  // Expected map name with Azure Functions Type
  Record<'req', HttpRequest> &
  Record<'timer', Timer>;

type ExpectedType_OnlyOutputBindings = ContextBindings &
  // Expected map name with Azure Functions Type
  Record<'res', HttpResponse> &
  Record<'$return', HttpResponse>;

type ExpectedType_OnlyReturnBindings = HttpResponse;

type Cases = [
  // Test all cases
  Expect<Equal<GetBindings<typeof bindings>, ExpectedType_AllBindings>>,
  Expect<Equal<GetOnlyInputBindings<typeof bindings>, ExpectedType_OnlyInputBindings>>,
  Expect<Equal<GetOnlyOutputBindings<typeof bindings>, ExpectedType_OnlyOutputBindings>>,
  Expect<Equal<GetOnlyReturnBindings<typeof bindings>, ExpectedType_OnlyReturnBindings>>
];
