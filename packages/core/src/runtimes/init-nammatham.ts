import { NammathamApp } from './nammatham-app';
import { AzureFunctionsTrigger } from './adapters/azure-functions';

export const initNammatham = {
  create(adatper?: any) {
    return {
      func: new AzureFunctionsTrigger(),
      app: new NammathamApp(),
    };
  },
};
