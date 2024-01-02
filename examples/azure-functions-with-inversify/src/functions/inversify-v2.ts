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

  inject<Name, OutputType>(name: Name, serviceIdentifier: interfaces.ServiceIdentifier<OutputType>) {
    return {} as Inversify<Items & {
        [key in Name extends string ? Name : never]: interfaces.ServiceIdentifier<OutputType>;
    }>;
  }

  resolve<TReturn>(func: (...args: any[]) => any): TReturn {
    return func();
  }
}

const result = new Inversify(container)
  .inject<'dataService', DataService>('dataService', DataService)
  .inject<'option', Option>('option', Tokens.Option)


type Result = typeof result.items;
    // ^?

