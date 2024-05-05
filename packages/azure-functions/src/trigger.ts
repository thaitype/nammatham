import type { HttpEndpointOption, WithEndpointOption } from '@nammatham/core';
import type {
  GenericFunctionOptions,
  HttpFunctionOptions,
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  Timer,
  TimerFunctionOptions,
  HttpMethodFunctionOptions,
  StorageQueueFunctionOptions,
  StorageBlobFunctionOptions,
  ServiceBusQueueFunctionOptions,
  ServiceBusTopicFunctionOptions,
  EventHubFunctionOptions,
  EventGridFunctionOptions,
  CosmosDBFunctionOptions,
  WarmupFunctionOptions,
  SqlFunctionOptions,
} from '@azure/functions';

import { app } from '@azure/functions';
import { BaseFunctionTrigger } from '@nammatham/core';

import type { FunctionOption } from './types';

import { AzureFunctionsHandler } from './handler';

export class AzureFunctionsTrigger extends BaseFunctionTrigger {
  generic(funcName: string, option: Omit<GenericFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.generic(funcName, {
          ...option,
          ...funcOption,
        });
      }
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
          route: option?.route ?? funcName,
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

  timer(funcName: string, option: Omit<TimerFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<Timer, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.timer(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  storageQueue(funcName: string, option: Omit<StorageQueueFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.storageQueue(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  storageBlob(funcName: string, option: Omit<StorageBlobFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.storageBlob(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  serviceBusQueue(funcName: string, option: Omit<ServiceBusQueueFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.serviceBusQueue(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }


  serviceBusTopic(funcName: string, option: Omit<ServiceBusTopicFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.serviceBusTopic(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  eventHub(funcName: string, option: Omit<EventHubFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.eventHub(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }


  eventGrid(funcName: string, option: Omit<EventGridFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.eventGrid(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }
  
  cosmosDB(funcName: string, option: Omit<CosmosDBFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.cosmosDB(funcName, {
          ...option,
          ...funcOption,
        } as any);
      }
    );
  }

  warmup(funcName: string, option: Omit<WarmupFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.warmup(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  sql(funcName: string, option: Omit<SqlFunctionOptions, 'handler'>) {
    return new AzureFunctionsHandler<unknown, unknown | void>(
      funcName,
      this.parseFunctionOption(funcName, option),
      funcOption => {
        app.sql(funcName, {
          ...option,
          ...funcOption,
        });
      }
    );
  }

  private parseFunctionOption(
    funcName: string,
    opt?: Partial<WithEndpointOption & FunctionOption>
  ): WithEndpointOption & FunctionOption {
    return {
      endpointOption: {
        ...opt?.endpointOption,
        route: (opt?.endpointOption as HttpEndpointOption)?.route ?? funcName,
        type: opt?.endpointOption?.type ?? 'generic',
      },
      extraInputs: opt?.extraInputs ?? [],
      extraOutputs: opt?.extraOutputs ?? [],
    };
  }
}
