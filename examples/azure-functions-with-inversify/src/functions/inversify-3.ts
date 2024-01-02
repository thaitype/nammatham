import 'reflect-metadata';
import { interfaces, Container, inject } from 'inversify';
import { DataService } from '../services/data';
import { Service } from '../services/service';
import { Tokens, Option } from '../constants';
import { container } from '../container';
type InversifyProviderFunc<T extends Record<string, unknown>, TReturn> = (services: T) => TReturn;

// eslint-disable-next-line @typescript-eslint/ban-types
class InversifyProvider<Items extends Record<string, interfaces.ServiceIdentifier<unknown>> = {}> {
  items: Items = {} as Items;

  constructor(private readonly container: Container) {}

  inject<OutputType, Name extends string>(name: Name, identifier: interfaces.ServiceIdentifier<OutputType>) {
    this.items = {
      ...this.items,
      [name]: identifier,
    };
    return new Injection<OutputType, Name, Items>(this, name);
  }

  resolve<TReturn>(func: InversifyProviderFunc<Items, TReturn>): TReturn {
    const services: Record<string, unknown> = {};
    Object.keys(this.items).forEach(key => {
      services[key] = this.container.get(this.items[key]);
    });
    return func(services as Items & Record<string, unknown>);
  }
}

class Injection<
  ToOutputType,
  Name extends string,
  Items extends Record<string, interfaces.ServiceIdentifier<unknown>>
> {
  constructor(private readonly provider: InversifyProvider<Items>, private readonly name: Name) {}

  to<OutputType extends ToOutputType>() {
    return this.provider as unknown as InversifyProvider<Items & Record<Name, OutputType>>;
  }
}

export function inversify(container: Container) {
  return new InversifyProvider(container);
}

const result = inversify(container)
  .inject('dataService', DataService).to<DataService>()
  .inject('service', Service).to<Service>()
  .inject('option', Tokens.Option).to<Option>()
  // .inject<Service>().with('service', Service)
  // .inject<Option>().with('option', Tokens.Option)
  .resolve(({ dataService, service, option }) => {
    console.log(`service.getData()`, service.getData());
    console.log(`dataService.getData()`, dataService.getData());
    console.log(`option`, option);
  });
