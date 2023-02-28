import { binding, BaseFunction, functionName } from 'nammatham';

const bindings = [
  binding.blobTrigger({
    path: 'original-images/{name}',
    connection: 'BlobConnectionString',
    name: 'inputBlob' as const,
  }),
  binding.blob_output({
    // path: 'resized-images/{userInfo.id}-{DateTime}.txt',
    path: 'resized-images/{name}.json',
    connection: 'BlobConnectionString',
    name: 'outputBlob' as const,
  }),
] as const;

@functionName('CopyBlobFunction', ...bindings)
export class CopyBlobFunction extends BaseFunction<typeof bindings> {

  public override execute() {
    this.log('typeof inputBlob:', typeof this.bindings.inputBlob);
    this.log('inputBlob.constructor.name:', this.bindings.inputBlob.constructor.name);
    this.log('bindingData:', JSON.stringify(this.context.bindingData));
    this.context.bindings.outputBlob = this.context.bindings.inputBlob;
  }
}
