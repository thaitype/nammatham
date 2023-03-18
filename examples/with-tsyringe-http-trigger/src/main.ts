import 'reflect-metadata';

import { NammathamFactory } from '@nammatham/core';
import { TsyringeAdapter } from '@nammatham/tsyringe';
import { MyController } from './functions/http-trigger';
import { MyService } from './my-service';

const app = NammathamFactory.create(new TsyringeAdapter());
app.addControllers(MyController);
// Using tsyringe Container API to bind service
app.services.container.register<MyService>(MyService, { useClass: MyService });
app.run();
