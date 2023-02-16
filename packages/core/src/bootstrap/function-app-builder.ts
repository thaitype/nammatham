import { Container } from 'inversify';
import { FunctionApp, IFunctionAppOption } from './function-app';
import { Services } from './services';
import process from 'process';
import { resolveAllAzureFunctions } from './attach-controllers';

interface IFunctionAppBuilderOption {
  container?: Container;
}

/**
 * This class will map `Controller` and `FunctionClass`
 */

export class FunctionAppBuilder {
  protected functionApp!: FunctionApp;
  protected functionAppOption: IFunctionAppOption;
  protected _container: Container;
  protected _services: Services;

  constructor(bootstrapPath: string, option?: IFunctionAppBuilderOption) {
    this._container = option?.container ?? new Container();
    this._services = new Services(this._container);
    this.functionAppOption = {
      bootstrapPath,
      container: this._container,
      controllers: [],
    };
  }

  public setContainer(container: Container) {
    this._container = container;
  }

  get container() {
    return this._container;
  }

  get services(){
    return this._services;
  }

  public configureServices(callback: (services: Services) => void) {
    callback(this._services);
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
      process.exit(1);
    }
  }

  // TODO: Refactor for isolated log class
  private throwError(message: string, verbose: boolean, error: unknown = null, exitCode = 1){
    if(error instanceof Error){
      console.error(`${message} ${error.message}`);
    } else {
      console.error(error);
    }
    if(verbose) console.error(error);
    process.exit(exitCode);
  }
  /**
   * Start generate files
   */
  build() {
    const env = {
      nammatham_env: process.env.nammatham_env,
      nammatham_verbose: process.env.nammatham_verbose === 'true' ? true : false,
    }
    this.isUnique(this.functionAppOption.controllers || [], 'controller');
    const nammathamMode = (env.nammatham_env ?? 'runtime').toLowerCase() as 'build' | 'runtime';
    this.functionApp = new FunctionApp(this.functionAppOption);
    /**
     * Binding at root in both build & runtime mode
     */
    this.functionApp.bindControllersWithContainer(this._container);
    /**
     * Deciding run mode
     */
    if (nammathamMode === 'build') {
      this.functionApp
        .build()
        .then(() => {
          console.log(`Nammatham generates Azure Function handlers successfully`);
        })
        .catch((error: unknown) => {
          this.throwError(`Nammatham generates failed with reason:`, env.nammatham_verbose, error);
        });
    } else if (nammathamMode === 'runtime') {
      console.log(`Nammatham initializes completed`);
    } else {
      this.throwError(`Not support '${nammathamMode}' mode, only support 'runtime' and 'build'`, env.nammatham_verbose);
    }
  }

  public getApp() {
    return this.functionApp;
  }

  public getFunctionNames(): string[] {
    const azureFunctionsMethodMetadata = resolveAllAzureFunctions(this.functionAppOption.controllers || []);
    return azureFunctionsMethodMetadata.map(m => m.name);
  }
}
