import 'reflect-metadata';
import { NammathamApp } from 'nammatham';
import { WithTypeUtilityFunction } from './controllers/with-type-utility.controller';
import { Service } from './controllers/services';
import { CustomTypeFunction } from './controllers/custom-type.function';

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

// builder.getContainer().bind(Service).toSelf();

/**
 * Using env var to enable the build process
 */
builder.build();

export default builder.getApp();
