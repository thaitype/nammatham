import type { EnvVariables } from './load-env-vars';
import type { HostConfigV2, LocalSettings, NammathamConfigs } from '../config-loader';

import { getExecutablePath } from '../build';

export function constructHostConfig(config: NammathamConfigs, mode: 'dev' | 'build'): string {
  let description: NonNullable<HostConfigV2['customHandler']>['description'] = {};
  let watchDirectories: HostConfigV2['watchDirectories'];
  if (mode === 'build') {
    description = {
      defaultExecutablePath: getExecutablePath(config.buildOptions?.target),
    };
  } else if (mode === 'dev') {
    description = {
      defaultExecutablePath: '../node_modules/.bin/tsx',
      arguments: ['watch', '../src/main.ts'],
    };
    watchDirectories = ['../src', '.'];
  }
  return JSON.stringify(
    {
      customHandler: {
        description,
        enableForwardingHttpRequest: true,
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
