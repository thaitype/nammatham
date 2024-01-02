import { interfaces } from 'inversify';
import { Tokens } from '../constants';
import { func } from '../nammatham';
import { DataService } from '../services/data';
import { Service } from '../services/service';

type ResolveItem<T = any> = {
  serviceIdentifier: interfaces.ServiceIdentifier<T>;
  type: any;
};

interface InversifyProvider<T extends Record<string, unknown>> {
  resolve: T;
}

type InversifyProviderFunc<T extends Record<string, unknown>, TReturn> = (services: T) => TReturn;

declare function inversify<T extends Record<string, unknown>, TReturn>(
  arg: InversifyProvider<T>,
  func: InversifyProviderFunc<T, TReturn>
): TReturn;

export default func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(
    inversify(
      {
        resolve: {
          dataService: DataService.prototype,
        },
      },
      ({ dataService }) =>
        async (request, ctx) => {
          ctx.context.log('HTTP trigger function processed a request.');
          ctx.context.debug(`Http function processed request for url "${request.url}"`);
          const name = request.query.get('name') || (await request.text()) || 'world';
          if (name === 'error') {
            throw new Error('this is an error');
          }
          return {
            body: dataService.getData(),
          };
        }
    )
  );

// Draft - type safe version

type InversifyProviderFuncMock<T extends Record<string, unknown>, TReturn> = (services: T) => TReturn;

declare function inversify2(...args: any[]): {
  addProviders: <T extends Record<string, unknown>>(
    services: T
  ) => {
    resolve: <TReturn>(func: InversifyProviderFuncMock<T, TReturn>) => TReturn;
  };
};

typeof DataService.prototype === typeof DataService; // False T_T

type ConvertClassFunctionToObject<T> = {
  [P in keyof T]: T[P];
};

type ConvertClassFunctionToObject2<T> = 'prototype' extends keyof T ? T['prototype'] : T;

type MyDataService = ConvertClassFunctionToObject<DataService>;
type MyDataService2 = ConvertClassFunctionToObject2<DataService>;
function test(service: MyDataService2){
  service.getData();
}

inversify2()
  .addProviders({
    dataService: { serviceIdentifier: DataService, type: DataService },
    service: { serviceIdentifier: Tokens.Service, type: Service },
  })
  .resolve(({ dataService, service }) => async (request, ctx) => {
    return {
      body: dataService.getData(),
    };
  });

// another version (I think best version)
type MockResolveType = {
  dataService: DataService;
  service: string;
};
// @ts-ignore
inversify3(container)
  .inject<DataService>({ dataService: DataService })
  .inject<string>({ service: Tokens.Service })
  .resolve(({ dataService, service }: MockResolveType) => async (request, ctx) => {
    return {
      body: dataService.getData(),
    };
  });

// Draft - non type safe version

declare function inversify3(...args: any[]): any;

// v3.1
inversify3()
  .addProviders([DataService, Tokens.Service])
  .resolve((dataService: DataService, service: string) => async (request, ctx) => {
    return {
      body: dataService.getData(),
    };
  });

// v3.2
inversify3({
  providers: [DataService, Tokens.Service],
  resolve: (dataService: DataService, service: string) => async (request, ctx) => {
    return {
      body: dataService.getData(),
    };
  },
});

inversify3({
  providers: [DataService, Tokens.Service],
  resolve(dataService: DataService, service: string) {
    return async (request, ctx) => {
      return {
        body: dataService.getData(),
      };
    };
  },
});
