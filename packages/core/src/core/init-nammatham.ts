import { NammathamApp } from './nammatham-app';
import { AzureFunctionsTrigger } from '../runtimes/azure-functions/trigger';

export const initNammatham = {
  create(adatper?: any) {
    return {
      func: new AzureFunctionsTrigger(),
      app: new NammathamApp(),
    };
  },
};
