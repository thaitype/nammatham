import { Container } from 'inversify';
import { DataService } from './services/data.service';
import { HomeController } from './controllers/home.controller';

export const container = new Container();
container.bind<DataService>(DataService).toSelf();
container.bind<HomeController>(HomeController).toSelf();
