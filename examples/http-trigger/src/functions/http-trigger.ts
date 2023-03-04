import { app, InvocationContext, HttpRequest, HttpHandler } from '@azure/functions';
import {
  Controller,
  Inject,
  Injectable,
  AuthorizationLevel,
  BlobOutput,
  BlobTrigger,
  Context,
  FunctionName,
  Get,
  HttpTrigger,
  Log,
  Logger,
  Post,
  Req,
  Res,
} from '@nammatham/inversify';

type HttpResponse = ReturnType<HttpHandler>;

@Controller()
export class MyController {
  @FunctionName('CopyBlob')
  public copyBlob(
    @BlobTrigger({ path: 'samples-workitems/{name}' }) blobInput: Buffer,
    @BlobOutput({ path: 'export/{name}' }) blobOutput: unknown,
    @Context() context: InvocationContext,
    @Logger() log: Log
  ) {
    log.info(blobInput.toString());
    log.info(context.functionName);
    blobOutput = blobInput;
  }

  @FunctionName('http')
  public httpTrigger(
    @HttpTrigger('anonymous', ['get'], '/my-data') req: HttpRequest,
    @Logger() log: Log
  ): HttpResponse {
    log.info(req.toString());
    return {
      body: 'Hello',
    };
  }

  // Shorthand of httpTrigger
  // Full Example of Shorthand
  // Auto generate function name = class name + method name
  // Default AuthorizationLevel is anonymous, this should be option
  @AuthorizationLevel('function')
  @Get('my-data')
  public simpleGet(
    @Req() req: HttpRequest,
    @Res() res: HttpResponse,
    @Context() context: InvocationContext,
    @Logger() log: Log
  ) {
    log.info(req.toString());
    // Don't sure for v4 model
    res = {
      body: 'Hello',
    };
  }

  // Default AuthorizationLevel is anonymous
  // Typically Use of Shorthand httpTrigger,
  @Post('my-data')
  public async simplePost(@Req() req: HttpRequest): Promise<HttpResponse> {
    const name = req.query.get('name') || (await req.text()) || 'world';
    return { body: `Hello, ${name}!` };
  }
}
