import 'reflect-metadata';
import { NammathamApp } from '../../../main';
import { WithTypeUtilityFunction } from './functions/with-type-utility.function';
import { SingletonService } from './services/singleton-service';
import { HttpTriggerHelperFunction } from './functions/http-trigger-helper.function';
import { ScopedService } from './services/scoped-service';
import { TransientService } from './services/transient-service';

export const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(WithTypeUtilityFunction, HttpTriggerHelperFunction);
builder.configureServices(services => {
  services.addSingleton(SingletonService);
  services.addScoped(ScopedService);
  services.addTransient(TransientService);
});

builder.build();

export default builder.getApp();
