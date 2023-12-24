import { NammathamApp } from './nammatham-app';
import { NammathamTrigger } from './nammatham-trigger';

export const initNammatham = {
  create(adatper?: any) {
    return {
      func: new NammathamTrigger(),
      app: new NammathamApp(),
    };
  },
};
