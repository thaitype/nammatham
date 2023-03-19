import { ParameterMetadata } from '../interfaces';
import { Extras } from './interfaces';

export function getExtras(mode: keyof Extras, extras: Extras, index: number) {
  const extra = extras[mode].find(config => config.index === index);
  if (!extra) throw new Error(`Extra type '${mode}' not found with params index: ${index}`);
  return extra;
}

export function extractExtras(params: ParameterMetadata[]) {
  const result: Extras = {
    inputs: [],
    outputs: [],
  };
  console.log('not implement yet');
  return result;
}
