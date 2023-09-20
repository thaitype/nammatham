import { PARAMETER_TYPE } from '../contants';
import { ParameterMetadata } from '../interfaces';
import { Extras, ParamsFunctionInput } from './types';
import { params } from '../decorators/params-factory';

export function getExtras(mode: keyof Extras, extras: Extras, index: number) {
  const extra = extras[mode].find(config => config.index === index);
  if (!extra) throw new Error(`Extra type '${mode}' not found with params index: ${index}`);
  return extra;
}

export function filterInputParam(params: ParameterMetadata[]): ParamsFunctionInput[] {
  console.log('not implement yet');
  return [
    {
      index: 0,
      option: params[0].option,
      config: params[0].option,
      type: PARAMETER_TYPE.BlobInput,
    },
  ];
}

export function extractExtras(params: ParameterMetadata[]) {
  const result: Extras = {
    inputs: filterInputParam(params),
    outputs: [],
  };
  console.log('not implement yet');
  console.log('extractExtras', params);
  return result;
}
