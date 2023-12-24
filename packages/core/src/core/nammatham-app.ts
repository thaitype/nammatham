import type { NammathamFunctionEndpoint } from "./types";

export class NammathamApp {
  start() {
    console.log('Starting app');
  }
  
  addFunctions(...functions: NammathamFunctionEndpoint<any, any>[]) {
    for(const func of functions) {
      this.addFunction(func);
    }
  }

  addFunction<TTriggerType, TReturnType>(func: NammathamFunctionEndpoint<TTriggerType, TReturnType>) {
    console.log('Adding function', func);
  }

  use(middleware: any) {
    console.log('Using middleware', middleware);
  }
}
