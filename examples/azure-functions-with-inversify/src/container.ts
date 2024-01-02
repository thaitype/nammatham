import { Container } from 'inversify';
import { DataService } from './services/data';
import { Service } from './services/service';

export const container = new Container();
container.bind<DataService>(DataService).toSelf();
container.bind<Service>(Service).toSelf();
