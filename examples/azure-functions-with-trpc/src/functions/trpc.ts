import { azureFunctionsRequestHandler } from 'trpc-azure-functions-adapter';
import { appRouter, createContext } from '../router';

azureFunctionsRequestHandler({
  router: appRouter,
  createContext,
});
