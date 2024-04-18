import 'reflect-metadata';
import { BaseHandlerResolver, expressPlugin, NammathamApp } from 'nammatham';
import { HomeController } from './controllers/home.controller';
import { app } from './nammatham';
import { container } from './container';
import { Container, interfaces } from 'inversify';
import { AppService } from './services/app.service';

// Uncomment this line to use inversify plugin
// import { inverisfyPlugin } from '@nammatham/inversify';

// Mock inversify plugin
declare function inverisfyPlugin(options: {
  container: Container;
  controllers?: interfaces.ServiceIdentifier[];
}): (app: NammathamApp, handlerResolver: BaseHandlerResolver) => void;

// Manually register controllers
// const homeController = new HomeController(container.get(DataService));
// app.addFunctions(homeController.hello);

// const userFunction = app.createFunctions({
//   user: func.httpGet().handler(({ res }) => res.text('OK'));
// });

// app.mergeFunctions(userFunction);

// Automatically register controllers
// Way 1
app.register(inverisfyPlugin({ container, controllers: [HomeController] }));

// Way 2
// Mock inversify plugin
declare function functionPlugin(options: {
  functions: any;
}): (app: NammathamApp, handlerResolver: BaseHandlerResolver) => void;

const appService = container.get(AppService);
app.register(functionPlugin({
  functions: appService.appFunctions,
}))

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
