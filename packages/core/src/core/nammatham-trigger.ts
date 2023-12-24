import type {
  HttpFunctionOptions,
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
} from '@azure/functions';
import { app } from '@azure/functions';
import { NammthamBindingHelper } from './nammatham-binding-helper';
import { NammathamFunction } from './nammatham-function';
import { FunctionOption } from './types';

export class NammathamTrigger extends NammthamBindingHelper {
  generic(funcName: string, option: any) {
    // TODO: Implement later
    return new NammathamFunction<unknown, unknown | void>(funcName, this.parseFunctionOption(option), option);
  }

  httpGet(funcName: string, option?: Omit<HttpFunctionOptions, 'handler'>) {
    return new NammathamFunction<HttpRequest, HttpResponseInit | HttpResponse>(
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
    return new NammathamFunction<HttpRequest, HttpResponseInit>(funcName, this.parseFunctionOption(option), option);
  }

  storageQueue(funcName: string, option: any) {
    // TODO: Implement later
    return new NammathamFunction<unknown, unknown>(funcName, this.parseFunctionOption(option), option);
  }

  private parseFunctionOption(option?: Partial<FunctionOption>): FunctionOption {
    return {
      extraInputs: option?.extraInputs ?? [],
      extraOutputs: option?.extraOutputs ?? [],
    };
  }
}
