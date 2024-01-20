import { BaseRuntimeAdapter, NammathamApp } from '@nammatham/core';

import { AzureFunctionsTrigger } from './trigger';
import { AzureFunctionsHandlerResolver } from './handler-resolver';

export class AzureFunctionsAdapter extends BaseRuntimeAdapter<AzureFunctionsTrigger> {
  createTrigger() {
    return new AzureFunctionsTrigger();
  }

  createApp() {
    const app = new NammathamApp(
      new AzureFunctionsHandlerResolver({
        /**
         * Azure Functions always start with /api
         */
        prefixPath: '/api',
      })
    );
    app.setRuntime('azure-functions');
    app.setDevelopment(false);
    return app;
  }
}
