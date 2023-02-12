import 'reflect-metadata';
import { NammathamApp } from '../../../src/main';
import { WithTypeUtilityFunction } from './functions/with-type-utility.controller';
import { Service } from './functions/services';

export const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(WithTypeUtilityFunction);
builder.configureServices(services => {
  services.addSingleton(Service);
});

builder.build();

export default builder.getApp();
