import { BaseFunctionBinding } from '../base-function-binding';

/**
 * Azure Functions Blob Type
 */
export type BlobType = 'blob';

/**
 * Blob Binding Input
 *
 * read more: [Blob Input Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-input?tabs=in-process&pivots=programming-language-javascript#configuration)
 */
export interface BlobBinding_Input<Name = unknown> extends BaseFunctionBinding<BlobType, Name> {
  type: BlobType;
  /**
   * Blob requires direction `in`
   */
  direction: 'in';
  /**
   * The path to the blob.
   */
  path: string;
  /**
   * The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-input?tabs=in-process&pivots=programming-language-javascript#connections).
   */
  connection: string;
  /**
   * 	For dynamically typed languages, specifies the underlying data type. Possible values are `string`, `binary`, or `stream`. For more detail, refer to the [triggers and bindings concepts](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=python#trigger-and-binding-definitions).
   */
  dataType?: 'string' | 'binary' | 'stream';
}

/**
 * Blob Binding Output
 *
 * read more: [Blob Output Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-output?tabs=in-process&pivots=programming-language-javascript#configuration)
 */
export interface BlobBinding_Output<Name = unknown> extends BaseFunctionBinding<BlobType, Name> {
  type: BlobType;
  /**
   * Blob requires direction `in`
   */
  direction: 'out';
  /**
   * The path to the blob.
   */
  path: string;
  /**
   * The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-input?tabs=in-process&pivots=programming-language-javascript#connections).
   */
  connection: string;
}