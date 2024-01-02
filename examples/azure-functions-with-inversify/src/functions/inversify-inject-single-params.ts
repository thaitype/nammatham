import 'reflect-metadata';
import { interfaces, Container } from 'inversify';
import { DataService } from '../services/data';
import { Service } from '../services/service';
import { Tokens, Option } from '../constants';
import { container } from '../container';

// eslint-disable-next-line @typescript-eslint/ban-types
class Inversify<Items extends Record<string, interfaces.ServiceIdentifier<unknown>> = {}> {
  items: Items = {} as Items;

  constructor(private readonly container: Container) {}

  inject<OutputType, NewItem extends Record<string, interfaces.ServiceIdentifier<OutputType>>>(item: NewItem) {
    return {} as Inversify<Items & NewItem>;
  }

  resolve<TReturn>(func: (...args: any[]) => any): TReturn {
    return func();
  }
}

new Inversify(container)
  .inject<DataService, { dataService: interfaces.ServiceIdentifier<DataService> }>({
    dataService: DataService,
  })
  .inject<Service, { service: interfaces.ServiceIdentifier<Service> }>({
    service: Service,
  })
  .inject<Option, { option: interfaces.ServiceIdentifier<Option> }>({
    option: Tokens.Option,
  });
