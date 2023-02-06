import { Container } from 'inversify';
import { FunctionApp, IFunctionAppOption } from './function-app';
import { Services } from './services';
import { exit } from 'process';

interface IFunctionAppBuilderOption {
  container?: Container;
}

/**
 * This class will map `Controller` and `FunctionClass`
 */

export class FunctionAppBuilder {
  protected functionApp!: FunctionApp;
  protected functionAppOption: IFunctionAppOption;
  protected container: Container;
  protected services: Services;

  constructor(bootstrapPath: string, option?: IFunctionAppBuilderOption) {
    this.container = option?.container ?? new Container();
    this.services = new Services(this.container);
    this.functionAppOption = {
      bootstrapPath,
      container: this.container,
      controllers: [],
    };
  }

  public setContainer(container: Container) {
    this.container = container;
  }

  public getContainer() {
    return this.container;
  }

  public configureServices(callback: (services: Services) => void) {
    callback(this.services);
  }

  /**
   * Register Function Class
   * @param functions
   * @returns `FunctionAppBuilder`
   */
  public addFunctions(...functions: NewableFunction[]) {
    this.functionAppOption.controllers?.push(...functions);
    return this;
  }

  private isUnique<T>(array: Array<T>, name?: string) {
    const set = new Set(array);
    if (array.length !== set.size) {
      console.error(`The array '${name}' is not unique`);
      exit(1);
    }
  }
  /**
   * Start generate files
   */
  build() {
    this.isUnique(this.functionAppOption.controllers || [], 'controller');

    const nammathamMode = (process.env.nammatham_env ?? 'runtime').toLowerCase() as 'build' | 'runtime';
    this.functionApp = new FunctionApp(this.functionAppOption);
    /**
     * Binding at root in both build & runtime mode
     */
    this.functionApp.bindControllersWithContainer(this.container);
    /**
     * Deciding run mode
     */
    if (nammathamMode === 'build') {
      console.log(`FunctionAppBuilder running build mode`);
      this.functionApp.build();
    } else if (nammathamMode === 'runtime') {
      console.log('runtime mode');
    } else {
      console.error(`Not support '${nammathamMode}' mode, only support 'runtime' and 'build'`);
      exit(1);
    }
  }

  public getApp() {
    return this.functionApp;
  }
}
