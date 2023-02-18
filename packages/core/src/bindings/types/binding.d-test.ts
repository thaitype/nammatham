import type { Equal, Expect } from '@type-challenges/utils';
import { BindingType, AllBindingTypes } from './binding';
import { HttpRequest, HttpResponse, Timer } from '@azure/functions';

type Cases_AllBindingTypes = [
  // All Built-in Support Binding Types
  Expect<Equal<AllBindingTypes, 'httpTrigger' | 'http' | 'timerTrigger' | 'cosmosDBTrigger'>>
];

type Cases_BindingType = [
  Expect<Equal<BindingType<'timerTrigger'>, Timer>>,
  Expect<Equal<BindingType<'http'>, HttpResponse>>,
  Expect<Equal<BindingType<'httpTrigger'>, HttpRequest>>,
  Expect<Equal<BindingType<'cosmosDBTrigger'>, any>>
];
