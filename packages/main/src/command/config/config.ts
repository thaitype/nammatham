import type { EnvVariables } from './load-env-vars';
import type { HostConfigV2, LocalSettings, NammathamConfigs } from '../config-loader';

import { debug } from './load-env-vars';
import { getExecutablePath } from '../build';

export function constructHostConfig(config: NammathamConfigs, mode: 'dev' | 'build'): string {
  let description: NonNullable<HostConfigV2['customHandler']>['description'] = {};
  let watchDirectories: HostConfigV2['watchDirectories'];
  if (mode === 'build') {
    description = {
      defaultExecutablePath: getExecutablePath(config.buildOptions?.target),
    };
  } else if (mode === 'dev') {
    if (config.runtime === 'node') {
      description = {
        defaultExecutablePath: '../node_modules/.bin/tsx',
        arguments: ['watch', '../src/main.ts'],
      };
    } else if (config.runtime === 'bun') {
      description = {
        defaultExecutablePath: 'bun',
        arguments: ['run', '--watch', '../src/main.ts'],
      };
    } else {
      throw new Error(`Unsupported runtime when genarate host.json: ${config.runtime}`);
    }
    debug?.(`Start server on execution path: ${description.defaultExecutablePath} ${description.arguments?.join(' ')}`);
    watchDirectories = ['../src', '.'];
  }
  return JSON.stringify(
    {
      customHandler: {
        description,
        /**
         * Enable forwarding HTTP request to the custom handler
         *
         * If this is set to true, the custom handler will receive the HTTP request and response objects
         * However, nammatham will not be not needs to be used in the custom handler
         *
         * Another reason for loggin, disabling this option will log on Azure Application Insights properly
         * @ref https://github.com/Azure/azure-functions-host/issues/6637
         *
         * @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-custom-handlers#http-only-function
         */
        enableForwardingHttpRequest: false,
      },
      watchDirectories,
      ...config.hostConfig,
    } as HostConfigV2,
    null,
    2
  );
}

export function constructLocalSettings(envVars?: EnvVariables): string {
  return JSON.stringify(
    {
      IsEncrypted: false,
      Values: {
        ...envVars,
        FUNCTIONS_WORKER_RUNTIME: 'custom',
        AzureWebJobsStorage: envVars?.AzureWebJobsStorage ?? 'UseDevelopmentStorage=true',
      },
    } satisfies LocalSettings,
    null,
    2
  );
}
