import type { HttpFunctionOptions, HttpRequest, HttpResponse, HttpResponseInit } from '@azure/functions';
import { app } from '@azure/functions';
import { AzureFunctionsHandler } from './handler';
import { FunctionOption } from './types';
import { BaseFunctionTrigger } from '../../bases';

export class AzureFunctionsTrigger extends BaseFunctionTrigger {
  generic(funcName: string, option: any) {
    // TODO: Implement later
    return new AzureFunctionsHandler<unknown, unknown | void>(funcName, this.parseFunctionOption(funcName, option), option);
  }

  httpGet(funcName: string, option?: Omit<HttpFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<HttpRequest, HttpResponseInit | HttpResponse>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.get(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  httpDelete(funcName: string, option: any) {
    // TODO: Implement later
    return new AzureFunctionsHandler<HttpRequest, HttpResponseInit>(funcName, this.parseFunctionOption(funcName, option), option);
  }

  storageQueue(funcName: string, option: any) {
    // TODO: Implement later
    return new AzureFunctionsHandler<unknown, unknown>(funcName, this.parseFunctionOption(funcName, option), option);
  }

  private parseFunctionOption(funcName: string, option?: Partial<FunctionOption>): FunctionOption {
    return {
      route: option?.route ?? funcName,
      extraInputs: option?.extraInputs ?? [],
      extraOutputs: option?.extraOutputs ?? [],
    };
  }
}
