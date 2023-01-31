import { IFuncBootstrapOption, funcBootstrap } from './function-bootstrap';

export class FunctionApp {
    public run(option: IFuncBootstrapOption){
      return funcBootstrap(option);
    }
  }