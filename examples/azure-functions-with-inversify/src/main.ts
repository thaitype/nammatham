import 'reflect-metadata';
import { expressPlugin } from 'nammatham';
import { HomeController } from './controllers/home.controller';
import { app } from './nammatham';
import { container } from './container';
import { DataService } from './services/data.service';

const homeController = new HomeController(container.get(DataService));
app.addFunctions(homeController.hello);

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
