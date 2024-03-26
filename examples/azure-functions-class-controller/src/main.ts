import 'reflect-metadata';
import { expressPlugin } from 'nammatham';
import { HomeController } from './controllers/home.controller';
import { app } from './nammatham';
import { injector } from '@di-extra/inversify';
import { DataService } from './services/data.service';
import { container } from './container';

function inverisfyPlugin(container: any, serviceIdentifier: any[]) {
  return {} as any;
}

// prettier-ignore
// const services = injector(container)
//   .inject('dataService', DataService).to<DataService>()
//   .resolve();
// const home = new HomeController(services.dataService);
app.register(inverisfyPlugin(container, [DataService]));
// app.addFunctions(home.hello);

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
