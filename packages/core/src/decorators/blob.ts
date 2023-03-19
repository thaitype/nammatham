import { PARAMETER_TYPE } from '../contants';
import { StorageBlobTriggerOptions, StorageBlobOutputOptions, StorageBlobInputOptions } from '@azure/functions';
import { paramDecoratorFactory } from './params-factory';

export const BlobTrigger: (option: StorageBlobTriggerOptions) => ParameterDecorator = paramDecoratorFactory(
  PARAMETER_TYPE.BlobTrigger
);

export const BlobOutput: (option: StorageBlobOutputOptions) => ParameterDecorator = paramDecoratorFactory(
  PARAMETER_TYPE.BlobOutput
);

export const BlobInput: (option: StorageBlobInputOptions) => ParameterDecorator = paramDecoratorFactory(
  PARAMETER_TYPE.BlobInput
);
