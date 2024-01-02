import { interfaces, Container } from 'inversify';
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

class Injection<OutputType, Items extends Record<string, interfaces.ServiceIdentifier<unknown>>> {
  constructor(private readonly provider: InversifyProvider<Items>) {}

  with<NewItem extends Record<string, interfaces.ServiceIdentifier<OutputType>>>(item: NewItem) {
    if (Object.keys(item).length > 1) {
      throw new Error('Only one item can be injected at a time');
    }
    this.provider.items = {
      ...(item as unknown as Items),
    };
    return this.provider as InversifyProvider<
      Items & {
        [K in keyof NewItem]: interfaces.ServiceIdentifier<OutputType>;
      }
    >;
  }
}

function inversify<T, TReturn>(container: Container) {
  return new InversifyProvider(container);
}

const container = new Container();
const result = inversify(container)
  .inject<DataService>().with({ dataService: DataService })
  .inject<Service>().with({ service: Service });
// .resolve(({ dataService, service }: MockResolveType) => async (request, ctx) => {
//   return {
//     body: dataService.getData(),
//   };
// });

const service = container.get(result.items.service);
console.log(`service.getData()`, service.getData());

