import { BaseFunctionBinding } from '../base-function-binding';

/**
 * Azure Functions BlobTrigger Type
 */
export type BlobTriggerType = 'blobTrigger';

/**
 * BlobTrigger Binding
 *
 * read more: [BlobTrigger Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-trigger?tabs=in-process&pivots=programming-language-javascript#configuration)
 */
export interface BlobTriggerBinding<Name = unknown> extends BaseFunctionBinding<BlobTriggerType, Name> {
  type: BlobTriggerType;
  /**
   * BlobTrigger requires direction `in`
   */
  direction: 'in';
  /**
   * The [container](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction#blob-storage-resources) to monitor. May be a [blob name pattern](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-trigger?tabs=in-process&pivots=programming-language-javascript#blob-name-patterns).
   */
  path: string;
  /**
   * The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-trigger?tabs=in-process&pivots=programming-language-javascript#connections).
   */
  connection: string;
}
