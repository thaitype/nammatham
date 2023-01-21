export type BindingType = 'httpTrigger' | 'http' | 'timerTrigger';
export type BindingDiection = 'in' | 'out';

export interface BaseFunctionBinding {
  type: BindingType;
  direction: BindingDiection;
  name: string;
}
