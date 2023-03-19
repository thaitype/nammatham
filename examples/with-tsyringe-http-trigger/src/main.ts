import 'reflect-metadata';

import { NammathamFactory } from '@nammatham/core';
import { TsyringeAdapter } from '@nammatham/tsyringe';
import { MyController } from './http-trigger.function';
import { MyService } from './my-service';

const app = NammathamFactory.create(new TsyringeAdapter());
app.addControllers(MyController);
// Using tsyringe Container API to bind service
app.container.register<MyService>(MyService, { useClass: MyService });
app.run();
