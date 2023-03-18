import 'reflect-metadata';

import { NammathamFactory } from '@nammatham/core';
import { InversifyAdapter } from '@nammatham/inversify';
import { MyController } from './functions/http-trigger';
import { MyService } from './my-service';

const app = NammathamFactory.create(new InversifyAdapter());
app.addControllers(MyController);
// Using Inversify Container API to bind service
app.services.container.bind(MyService).toSelf();
app.run();
