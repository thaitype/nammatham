import { BaseFunctionBinding } from '../base-function-binding';

export interface TimerTriggerBinding extends BaseFunctionBinding {
  type: 'timerTrigger';
  schedule: string;
}
