import { app, InvocationContext, HttpRequest, HttpHandler } from '@azure/functions';
import {
  controller,
  authorizationLevel,
  blobOutput,
  blobTrigger,
  context,
  functionName,
  httpGet,
  httpTrigger,
  Logger,
  logger,
  httpPost,
  req,
  res,
} from '@nammatham/inversify';


type HttpResponse = ReturnType<HttpHandler>;

@controller()
export class MyController {
  @functionName('CopyBlob')
  public copyBlob(
    @blobTrigger({ path: 'samples-workitems/{name}' }) blobInput: Buffer,
    @blobOutput({ path: 'export/{name}' }) blobOutput: unknown,
    @context() context: InvocationContext,
    @logger() log: Logger
  ) {
    log.info(blobInput.toString());
    log.info(context.functionName);
    blobOutput = blobInput;
  }

  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['get'], route: '/my-data' }) req: HttpRequest,
    @logger() log: Logger
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
  @authorizationLevel('function')
  @httpGet('my-data')
  public simpleGet(
    @req() req: HttpRequest,
    @res() res: HttpResponse,
    @context() context: InvocationContext,
    @logger() log: Logger
  ) {
    log.info(req.toString());
    // Don't sure for v4 model
    res = {
      body: 'Hello',
    };
  }

  // Typically Use of Shorthand httpTrigger,
  @httpPost('my-data')
  public async simplePost(@req() req: HttpRequest): HttpResponse {
    const name = req.query.get('name') || (await req.text()) || 'world';
    return { body: `Hello, ${name}!` };
  }
}