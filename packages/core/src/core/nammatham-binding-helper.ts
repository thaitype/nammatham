import type { StorageBlobInputOptions, StorageBlobOutputOptions } from './types';
import type { GenericInputOptions, GenericOutputOptions } from '@azure/functions';

export class NammthamBindingHelper {
  public readonly input = {
    storageBlob: (option: Omit<StorageBlobInputOptions, 'type'>) => ({ ...option, type: 'blob' as const }),
    generic: (option: GenericInputOptions) => option,
  };
  public readonly output = {
    storageBlob: (option: Omit<StorageBlobOutputOptions, 'type'>) => ({ ...option, type: 'blob' as const }),
    generic: (option: GenericOutputOptions) => option,
  };
}
