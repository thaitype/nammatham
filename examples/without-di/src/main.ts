import 'reflect-metadata';

import { NammathamFactory } from '@nammatham/core';
import { MyController } from './functions/http-trigger';

const app = NammathamFactory.create();
app.addControllers(MyController);
app.run();
