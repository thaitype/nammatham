import { Context, FunctionName, InvocationContext, BlobTrigger, BlobOutput, BlobInput } from '@nammatham/core';
import { Controller, Inject } from '@nammatham/inversify';
import { MyService } from './my-service';

type Output<T> = {
  set: (...args: any[]) => void;
}

type Input<T extends 'blob'> = {
  set: (...args: any[]) => void;
}

@Controller()
export class MyController {
  constructor(@Inject(MyService) protected myService: MyService) {}

  @FunctionName('CopyBlob')
  public copyBlob(
    @BlobTrigger({ path: '', connection: '' }) trigger: Buffer,
    @BlobInput({ path: '', connection: '' }) blobInput: Input<'blob'>,
    @BlobOutput({ path: '', connection: '' }) blobOutput: Output<'blob'>,
    @Context() context: InvocationContext
  ) {
    context.info(blobInput.toString());
    context.info(context.functionName);
    context.info(`Service name is '${this.myService.name}'`);

    blobOutput.set(blobInput);
  }
}
