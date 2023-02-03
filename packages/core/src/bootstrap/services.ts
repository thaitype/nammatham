import { Container, interfaces } from 'inversify';

type Constructor<T> = new (...args: never[]) => T;

export class Services {

  constructor(protected container: Container) {}

  public addTransient<T>(constructor: Constructor<T>): Services;
  public addTransient<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>, constructor: Constructor<T>): Services;

  public addTransient<T>(constructorOrServiceIdentifier: Constructor<T> | interfaces.ServiceIdentifier<T>, constructor?: Constructor<T>){
    if(constructor !== undefined){
      this.container.bind<T>(constructorOrServiceIdentifier).to(constructor).inTransientScope();
    } else {
      this.container.bind<T>(constructorOrServiceIdentifier).toSelf().inTransientScope();
    }
    return this;
  }

  public addSingleton<T>(constructor: Constructor<T>): Services;
  public addSingleton<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>, constructor: Constructor<T>): Services;

  public addSingleton<T>(constructorOrServiceIdentifier: Constructor<T> | interfaces.ServiceIdentifier<T>, constructor?: Constructor<T>){
    if(constructor !== undefined){
      this.container.bind<T>(constructorOrServiceIdentifier).to(constructor).inSingletonScope();
    } else {
      this.container.bind<T>(constructorOrServiceIdentifier).toSelf().inSingletonScope();
    }
    return this;
  }

  public addScoped<T>(constructor: Constructor<T>): Services;
  public addScoped<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>, constructor: Constructor<T>): Services;

  public addScoped<T>(constructorOrServiceIdentifier: Constructor<T> | interfaces.ServiceIdentifier<T>, constructor?: Constructor<T>){
    if(constructor !== undefined){
      this.container.bind<T>(constructorOrServiceIdentifier).to(constructor).inRequestScope();
    } else {
      this.container.bind<T>(constructorOrServiceIdentifier).toSelf().inRequestScope();
    }
    return this;
  }

}
