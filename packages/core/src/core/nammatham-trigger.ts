import type { HttpRequest, HttpResponse, HttpResponseInit, HttpTriggerOptions } from '@azure/functions';
import { app } from '@azure/functions';
import { NammthamBindingHelper } from './nammatham-binding-helper';
import { NammathamFunction } from './nammatham-function';

export class NammathamTrigger extends NammthamBindingHelper {
  generic(funcName: string, option: any) {
    return new NammathamFunction<unknown, unknown | void>(funcName, option);
  }

  get(funcName: string, option?: HttpTriggerOptions) {
    return new NammathamFunction<HttpRequest, HttpResponseInit | HttpResponse>(funcName, funcOption => {
      app.get(funcName, {
        ...option,
        ...funcOption,
      });
    });
  }

  delete(funcName: string, option: any) {
    return new NammathamFunction<HttpRequest, HttpResponseInit>(funcName, option);
  }

  storageQueue(funcName: string, option: any) {
    return new NammathamFunction<unknown, unknown>(funcName, option);
  }
}
