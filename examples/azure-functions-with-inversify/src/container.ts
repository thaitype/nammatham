import { Container} from 'inversify';
import { DataService } from './services/data';
import { Service } from './services/service';
import { Tokens, Option } from './constants';


export const container = new Container();
container.bind<DataService>(DataService).toSelf();
container.bind<Service>(Service).toSelf();

container
  .bind<Option>(Tokens.Option)
  .toConstantValue({
    name: 'test-value',
  });