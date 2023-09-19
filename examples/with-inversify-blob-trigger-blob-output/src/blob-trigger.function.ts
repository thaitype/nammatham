import {
  Context,
  FunctionName,
  InvocationContext,
  BlobTrigger,
  BlobOutput,
  BlobInput,
  HttpTrigger,
  Res,
  Response,
} from '@nammatham/core';
import { Controller, Inject } from '@nammatham/inversify';
import { MyService } from './my-service';

// TODO: need to be improved
class ExtraOutput {
  constructor(private name: string, private context: InvocationContext) {}
  public set(blob: unknown) {
    this.context.extraOutputs.set(this.name, blob);
  }
}

@Controller()
export class MyController {
  constructor(@Inject(MyService) protected myService: MyService) {}

  @FunctionName('CopyBlob')
  public copyBlob(
    @HttpTrigger({ authLevel: 'anonymous', methods: ['GET'] }) req: Request,
    @Res() res: Response,
    // @BlobTrigger({ path: '', connection: 'AzureWebJobsStorage' }) trigger: Buffer,
    /**
     * Automatically get via `context.extraInputs.get(blobInput)`
     */
    @BlobInput({ path: 'demo-input', connection: 'AzureWebJobsStorage' }) blobInput: Buffer,
    /**
     * Return Output Object
     *  e.g. blobOutput.set(blobInput)
     */
    @BlobOutput({ path: 'demo-output', connection: 'AzureWebJobsStorage' }) blobOutput: ExtraOutput,
    @Context() context: InvocationContext
  ) {
    // context.log('trigger', trigger);
    context.log('blobInput', blobInput);
    context.log('blobOutput', blobOutput);
    // context.info(blobInput.toString());
    context.info(context.functionName);
    context.info(`Service name is '${this.myService.name}'`);

    return res.send('Success');
    // blobOutput.set(blobInput);
  }
}
