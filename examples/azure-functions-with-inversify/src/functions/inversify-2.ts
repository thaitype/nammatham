import 'reflect-metadata';
import { interfaces, Container } from 'inversify';
import { DataService } from '../services/data';
import { Service } from '../services/service';
import { Tokens, Option } from '../constants';
import { container } from '../container';
type InversifyProviderFunc<T extends Record<string, unknown>, TReturn> = (services: T) => TReturn;

// eslint-disable-next-line @typescript-eslint/ban-types
class InversifyProvider<Items extends Record<string, interfaces.ServiceIdentifier<unknown>> = {}> {
  items: Items = {} as Items;

  constructor(private readonly container: Container) {}

  inject<OutputType>() {
    return new Injection<OutputType, Items>(this);
  }

  resolve<TReturn>(func: InversifyProviderFunc<Items, TReturn>): TReturn {
    const services: Record<string, unknown> = {};
    Object.keys(this.items).forEach(key => {
      services[key] = this.container.get(this.items[key]);
    });
    return func(services as Items & Record<string, unknown>);
  }
}

class Injection<OutputType, Items extends Record<string, interfaces.ServiceIdentifier<unknown>>> {
  constructor(private readonly provider: InversifyProvider<Items>) {}

  with<Name extends string, WithOutputType extends OutputType>(
    name: Name,
    item: interfaces.ServiceIdentifier<WithOutputType>
  ) {
    this.provider.items = {
      ...this.provider.items,
      [name]: item,
    };
    return this.provider as InversifyProvider<Items & Record<Name, WithOutputType>>;
  }
}

export function inversify(container: Container) {
  return new InversifyProvider(container);
}

const result = inversify(container)
  .inject<DataService>().with('dataService', DataService)
  .inject<Service>().with('service', Service)
  .inject<Option>().with('option', Tokens.Option)
  .resolve(({ dataService, service, option }) => {
    console.log(`service.getData()`, service.getData());
    console.log(`dataService.getData()`, dataService.getData());
    console.log(`option`, option);
  });