import { Container } from 'inversify';
import { DataService } from './services/data.service';

export const container = new Container();
container.bind<DataService>(DataService).toSelf();

