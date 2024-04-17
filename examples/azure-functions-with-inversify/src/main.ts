import 'reflect-metadata';
import { BaseHandlerResolver, expressPlugin, NammathamApp } from 'nammatham';
import { HomeController } from './controllers/home.controller';
import { app } from './nammatham';
import { container } from './container';
import { Container, interfaces } from 'inversify';

// Uncomment this line to use inversify plugin
// import { inverisfyPlugin } from '@nammatham/inversify';

// Mock inversify plugin
declare function inverisfyPlugin(options: {
  container: Container;
  controllers: interfaces.ServiceIdentifier[];
}): (app: NammathamApp, handlerResolver: BaseHandlerResolver) => void;

// Manually register controllers
// const homeController = new HomeController(container.get(DataService));
// app.addFunctions(homeController.hello);

// Automatically register controllers
app.register(inverisfyPlugin({ container, controllers: [HomeController] }));

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
