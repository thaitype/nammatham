import { FunctionAppBuilder } from './function-app-builder';

export class NammathamApp {
  public static createBuilder(bootstrapPath: string) {
    return new FunctionAppBuilder(bootstrapPath);
  }
}
