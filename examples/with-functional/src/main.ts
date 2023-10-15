import { NammathamTrigger } from '@nammatham/core';
import hello from './functions/hello';
import blob from './functions/blob';

class NammathamApp {
  private routes: NammathamTrigger[];
  constructor() {
    this.routes = [];
  }

  addRoute(route: NammathamTrigger) {
    this.routes.push(route);
    return this;
  }
}

const initNammatham = {
  create: () => new NammathamApp(),
};

const app = initNammatham.create();

app.addRoute('test',hello).addRoute(blob);
