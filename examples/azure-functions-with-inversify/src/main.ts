import 'reflect-metadata';
import { expressPlugin } from 'nammatham';
import { HomeController } from './controllers/home.controller';
import { app } from './nammatham';
import { container } from './container';

// Import the inversify plugin
import { inverisfyPlugin } from '@nammatham/inversify';

// Manually register controllers
// const homeController = new HomeController(container.get(DataService));
// app.addFunctions(homeController.hello);

// Automatically register controllers
app.register(inverisfyPlugin({ container, services: [HomeController] }));

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
