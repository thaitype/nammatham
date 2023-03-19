import { InvocationContext, app } from '@azure/functions';
import { PARAMETER_TYPE } from '../contants';
import { ParameterMetadata } from '../interfaces';
import { Extras } from './interfaces';

type Handler<T = unknown> = (triggerData: T, context: InvocationContext) => void;

interface TriggerParamPosition {
  index: number;
  type: PARAMETER_TYPE.HttpTrigger | PARAMETER_TYPE.BlobTrigger;
}

function identifyTriggerType(params: ParameterMetadata[]) {
  const triggers: TriggerParamPosition[] = [];
  for (let index = 0; index < params.length; index++) {
    const param = params[index];
    const type = param.type;
    if (type === PARAMETER_TYPE.HttpTrigger) triggers.push({ index, type });
    if (type === PARAMETER_TYPE.BlobTrigger) triggers.push({ index, type });
  }
  if (triggers.length === 0) throw new Error('Should provide at least one trigger type.');
  if (triggers.length > 1) throw new Error('Allow only 1 trigger type per function.');
  return triggers[0];
}

export function bindTriggerWithAzureFunctions(
  functionName: string,
  handler: Handler,
  params: ParameterMetadata[],
  extra: Extras
) {
  const { index, type } = identifyTriggerType(params);
  const commonOption = {
    extraInputs: extra.inputs.map(input => input.config),
    extraOutputs: extra.outputs.map(output => output.config),
    handler,
  };
  switch (type) {
    case PARAMETER_TYPE.HttpTrigger:
      return app.http(functionName, {
        ...params[index].option,
        ...commonOption,
      });

    case PARAMETER_TYPE.BlobTrigger:
      return app.storageBlob(functionName, {
        ...params[index].option,
        ...commonOption,
      });

    default:
      throw new Error('Unsupport trigger type.');
  }
}
