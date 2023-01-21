import { HttpTriggerRequestBinding, HttpTriggerResponseBinding, TimerTriggerBinding } from './triggers';

export type FunctionBinding = HttpTriggerRequestBinding | HttpTriggerResponseBinding | TimerTriggerBinding;
