import { Container } from 'inversify';
import { IFunctionModule, FunctionApp, IFunctionAppOption } from './function-app';
import { exit } from 'process';

interface IFunctionAppBuilderOption {
  container?: Container;
}

export class FunctionAppBuilder {

  protected functionApp!: FunctionApp;
  protected functionAppOption: IFunctionAppOption;
  protected container: Container;

  constructor(bootstrapPath: string, option?: IFunctionAppBuilderOption) {
    console.log(`init FunctionAppBuilder`);
    this.container = option?.container ?? new Container();
    this.functionAppOption = {
      bootstrapPath,
      container: this.container,
      controllers: [],
      providers: []
    };
  }

  public setContainer(container: Container) {
    this.container = container;
  }

  /**
   * Add Controller into root modules
   * @param controllers 
   * @returns 
   */
  public addControllers(...controllers: NonNullable<IFunctionModule['controllers']>) {
    this.functionAppOption.controllers?.push(...controllers);
    return this;
  }

  /**
   * Add Providers into root modules, this will automatically resolve
   * @param controllers 
   * @returns 
   */
  public addProviders(...providers: NonNullable<IFunctionModule['providers']>) {
    this.functionAppOption.providers?.push(...providers);
    return this;
  }

  /**
   * Register custom provider into root modules
   * @param register 
   * @returns 
   */
  public register(register: NonNullable<IFunctionModule['register']>) {
    this.functionAppOption.register = register;
    return this;
  }

  /**
   * Start generate files
   */
  build() {
    const nammathamMode = (process.env.nammatham_env ?? 'runtime').toLowerCase() as 'build'| 'runtime';
    this.functionApp = new FunctionApp(this.functionAppOption);
    /**
     * Binding at root in both build & runtime mode
     */
    this.functionApp.bindModuleWithContainer(this.container);
    /**
     * Deciding run mode
     */
    if (nammathamMode === 'build') {
      /**
       * TODO: Resolve container in each endpoint
       */
      console.log(`FunctionAppBuilder running build mode`)
      this.functionApp.build();
    } else if(nammathamMode === 'runtime') {
      console.log('runtime mode')
    } else {
      console.error(`Not support '${nammathamMode}' mode, only support 'runtime' and 'build'`);
      exit(1);
    }
  }

  public getApp() {
    return this.functionApp;
  }
}