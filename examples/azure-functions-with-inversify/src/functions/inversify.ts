import { interfaces, Container } from 'inversify';
import { Tokens } from '../constants';
import { func } from '../nammatham';
import { DataService } from '../services/data';
import { Service } from '../services/service';

// eslint-disable-next-line @typescript-eslint/ban-types
class InversifyProvider<Items extends Record<string, interfaces.ServiceIdentifier<unknown>> = {}> {
  items: Items = {} as Items;

  constructor(private readonly container: Container) {}

  inject<OutputType>() {
    return new Injection<OutputType, Items>(this);
  }

  resolve<TReturn>(func: (...args: any[]) => any): TReturn {
    return func();
  }
}

class Injection<T, Items extends Record<string, interfaces.ServiceIdentifier<unknown>>> {
  constructor(private readonly provider: InversifyProvider<Items>) {}

  with<NewItem extends Record<string, interfaces.ServiceIdentifier<T>>>(item: NewItem) {
    this.provider.items = {
      ...(item as unknown as Items),
    };
    return this.provider as InversifyProvider<Items & NewItem>;
  }
}

function inversify<T, TReturn>(container: Container) {
  return new InversifyProvider(container);
}

const container = new Container();
const result =inversify(container)
  .inject<DataService>().with({ dataService: DataService })
  .inject<string>().with({ service: Tokens.Service })
  // .resolve(({ dataService, service }: MockResolveType) => async (request, ctx) => {
  //   return {
  //     body: dataService.getData(),
  //   };
  // });

type A = typeof result.items
  // ^?