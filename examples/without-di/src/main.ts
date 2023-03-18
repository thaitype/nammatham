import 'reflect-metadata';

import { NammathamFactory } from '@nammatham/core';
import { MyController } from './http-trigger.function';

const app = NammathamFactory.create();
app.addControllers(MyController);
app.run();
