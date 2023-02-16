import 'reflect-metadata';
import { NammathamApp } from 'nammatham';
import { WithTypeUtilityFunction } from './functions/with-type-utility.controller';
import { CustomTypeFunction } from './functions/custom-type.function';
import { Service } from './functions/services';

const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(WithTypeUtilityFunction, CustomTypeFunction);
builder.configureServices(services => {
  services.addSingleton(Service);
  // services.addScoped(Service);
  // services.addTransient(Service);
});

// https://stackoverflow.com/questions/38138100/addtransient-addscoped-and-addsingleton-services-differences

// Transient objects are always different; a new instance is provided to every controller and every service.

// Scoped objects are the same within a request, but different across different requests.

// Singleton objects are the same for every object and every request.

/**
 * Using env var to enable the build process
 */
builder.build();

export default builder.getApp();
