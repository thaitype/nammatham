import { NammamthamEndpoint } from './types';

export class NammathamApp {
  start() {
    console.log('Starting app');
  }

  addFunctions(...functions: NammamthamEndpoint[]) {
    for (const func of functions) {
      this.addFunction(func);
    }
  }

  addFunction(func: NammamthamEndpoint) {
    console.log('Adding function', func);
  }

  use<TReturn>(middleware: (app: NammathamApp) => TReturn) {
    console.log('Using middleware');
    middleware(this);
  }
}
