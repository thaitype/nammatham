import 'reflect-metadata';

import { NammathamFactory } from '@nammatham/core';
import { InversifyAdapter } from '@nammatham/inversify';
import { MyController } from './functions/http-trigger';

const app = NammathamFactory.create(new InversifyAdapter());
app.addControllers(MyController);
app.run();
