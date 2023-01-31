import { Container } from 'inversify';
import { FunctionApp } from './function-app';
import { IFunctionModule, bootstrap } from './bootstrap';

export class FunctionAppBuilder {
    private container: Container = new Container();
    constructor(private bootstrapPath: string) {}
  
    public setContainer(container: Container){
      this.container = container;
    }
    
    public addControllers(...controllers: NewableFunction[]){
      return this;
    }
  
    public addProviders(...providers: NewableFunction[]){
      return this;
    }
  
    public createApp() {
      return new FunctionApp();
    }
  
    public addModule(module: IFunctionModule) {
      if(module.register)
        module.register(this.container);
      return this;
    }
  
    /**
     * Start generate files
     */
    build() {
      const buildCommand = process.env.test;
      if(buildCommand){
        bootstrap({} as any);
      }

    }
  }
  