import type {
  HttpFunctionOptions,
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
} from '@azure/functions';
import { app } from '@azure/functions';
import { AzureFunctionsHandler } from './handler';
import { FunctionOption } from './types';
import { BaseFunctionTrigger } from '../../base-function-trigger';

export class AzureFunctionsTrigger extends BaseFunctionTrigger {

  generic(funcName: string, option: any) {
    // TODO: Implement later
    return new AzureFunctionsHandler<unknown, unknown | void>(funcName, this.parseFunctionOption(option), option);
  }

  httpGet(funcName: string, option?: Omit<HttpFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<HttpRequest, HttpResponseInit | HttpResponse>(
      funcName,
      this.parseFunctionOption(option),
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
    return new AzureFunctionsHandler<HttpRequest, HttpResponseInit>(funcName, this.parseFunctionOption(option), option);
  }

  storageQueue(funcName: string, option: any) {
    // TODO: Implement later
    return new AzureFunctionsHandler<unknown, unknown>(funcName, this.parseFunctionOption(option), option);
  }

  private parseFunctionOption(option?: Partial<FunctionOption>): FunctionOption {
    return {
      extraInputs: option?.extraInputs ?? [],
      extraOutputs: option?.extraOutputs ?? [],
    };
  }
}
