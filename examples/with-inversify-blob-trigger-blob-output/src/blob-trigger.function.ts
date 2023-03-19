import { Context, FunctionName, InvocationContext, BlobTrigger, BlobOutput } from '@nammatham/core';
import { Controller, Inject } from '@nammatham/inversify';
import { MyService } from './my-service';

@Controller()
export class MyController {
  constructor(@Inject(MyService) protected myService: MyService) {}

  @FunctionName('CopyBlob')
  public copyBlob(
    @BlobTrigger({ path: '', connection: '' }) blobInput: Buffer,
    @BlobOutput({ path: '', connection: '' }) blobOutput: unknown,
    @Context() context: InvocationContext
  ) {
    context.info(blobInput.toString());
    context.info(context.functionName);
    context.info(`Service name is '${this.myService.name}'`);
    blobOutput = blobInput;
  }
}
