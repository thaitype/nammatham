import type { HttpFunctionOptions, HttpRequest, HttpResponse, HttpResponseInit } from '@azure/functions';
import { app, HttpMethodFunctionOptions } from '@azure/functions';
import { AzureFunctionsHandler } from './handler';
import { FunctionOption } from './types';
import { BaseFunctionTrigger } from '../../bases';
import { HttpEndpointOption, WithEndpointOption } from '../../types';
import { logger } from '../../../core/logger';

export class AzureFunctionsTrigger extends BaseFunctionTrigger {
  generic(funcName: string, option: any) {
    // TODO: Implement later
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      option
    );
  }

  httpGet(funcName: string, option?: Omit<HttpMethodFunctionOptions, 'handler'>) {
    return this.http(funcName, {
      ...option,
      methods: ['GET'],
    });
  }

  httpPost(funcName: string, option?: Omit<HttpMethodFunctionOptions, 'handler'>) {
    return this.http(funcName, {
      ...option,
      methods: ['POST'],
    });
  }

  httpPut(funcName: string, option?: Omit<HttpMethodFunctionOptions, 'handler'>) {
    return this.http(funcName, {
      ...option,
      methods: ['PUT'],
    });
  }

  httpDelete(funcName: string, option?: Omit<HttpMethodFunctionOptions, 'handler'>) {
    return this.http(funcName, {
      ...option,
      methods: ['DELETE'],
    });
  }

  http(funcName: string, option?: Omit<HttpFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<HttpRequest, HttpResponseInit | HttpResponse>(
      funcName,
      this.parseFunctionOption(funcName, {
        ...option,
        endpointOption: {
          type: 'http',
          route: option?.route,
          methods: option?.methods,
        },
      }),
      funcOption => {
        app.http(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  storageQueue(funcName: string, option: any) {
    // TODO: Implement later
    return new AzureFunctionsHandler<unknown, unknown>(funcName, this.parseFunctionOption(funcName, option), option);
  }

  private parseFunctionOption(
    funcName: string,
    opt?: Partial<WithEndpointOption & FunctionOption>
  ): WithEndpointOption & FunctionOption {
    return {
      endpointOption: {
        ...opt?.endpointOption,
        route: (opt?.endpointOption as HttpEndpointOption)?.route ?? funcName,
      },
      extraInputs: opt?.extraInputs ?? [],
      extraOutputs: opt?.extraOutputs ?? [],
    };
  }
}
