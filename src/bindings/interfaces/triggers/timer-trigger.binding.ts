import { BaseFunctionBinding } from '../base-function-binding';

export interface TimerTriggerBinding extends BaseFunctionBinding<'timerTrigger'> {
  type: 'timerTrigger';
  schedule: string;
}
