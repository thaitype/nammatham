import { NammamthamEndpoint } from './types';

export class NammathamApp {

  protected readonly _functions: NammamthamEndpoint[] = [];

  start() {
    // TODO: Implement later
    // Start register functions on the runtime e.g. Azure Functions
    console.log('Starting app');
  }

  addFunctions(...functions: NammamthamEndpoint[]) {
    for (const func of functions) {
      this.addFunction(func);
    }
  }

  addFunction(func: NammamthamEndpoint) {
    console.debug(`Adding function "${func.name}" on route: ${func.route}`, func);
    this._functions.push(func);
  }

  use<TReturn>(middleware: (app: NammathamApp) => TReturn) {
    console.log('Using middleware');
    middleware(this);
  }

  get functions() {
    return this._functions;
  }
}
