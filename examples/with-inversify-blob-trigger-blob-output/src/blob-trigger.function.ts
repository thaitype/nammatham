import { Context, FunctionName, InvocationContext, BlobTrigger, BlobOutput, BlobInput } from '@nammatham/core';
import { Controller, Inject } from '@nammatham/inversify';
import { MyService } from './my-service';

// TODO: need to be improved
class ExtraOutput {
  constructor(private name: string, private context: InvocationContext){}
  public set(blob: unknown) {
    this.context.extraOutputs.set(this.name, blob);
  }
}

@Controller()
export class MyController {
  constructor(@Inject(MyService) protected myService: MyService) {}

  @FunctionName('CopyBlob')
  public copyBlob(
    @BlobTrigger({ path: '', connection: '' }) trigger: Buffer,
    /**
     * Automatically get via `context.extraInputs.get(blobInput)`
     */
    @BlobInput({ path: '', connection: '' }) blobInput: Buffer,
    /**
     * Return Output Object
     *  e.g. blobOutput.set(blobInput)
     */
    @BlobOutput({ path: '', connection: '' }) blobOutput: ExtraOutput,
    @Context() context: InvocationContext
  ) {
    context.info(blobInput.toString());
    context.info(context.functionName);
    context.info(`Service name is '${this.myService.name}'`);

    blobOutput.set(blobInput);
  }
}
