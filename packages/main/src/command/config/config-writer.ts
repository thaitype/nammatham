import fs from 'node:fs';
import path from 'node:path';

import type { EnvVariables } from './load-env-vars';
import type { LocalSettings, NammathamConfigs } from '../config-loader';

export async function writeConfig(config: NammathamConfigs, envVars: EnvVariables) {
  const tmpPath = path.resolve(config.buildPath ?? './nmt');
  await Promise.all([
    fs.promises.writeFile(path.join(tmpPath, 'host.json'), constructHostConfig(config), 'utf-8'),
    fs.promises.writeFile(path.join(tmpPath, 'local.settings.json'), constructLocalSettings(envVars), 'utf-8'),
  ]);
}

function constructHostConfig(config: NammathamConfigs): string {
  return JSON.stringify(config.hostConfig, null, 2);
}

function constructLocalSettings(envVars: EnvVariables): string {
  return JSON.stringify(
    {
      IsEncrypted: false,
      Values: {
        ...envVars,
        FUNCTIONS_WORKER_RUNTIME: 'custom',
        AzureWebJobsStorage: envVars.AzureWebJobsStorage ?? 'UseDevelopmentStorage=true',
      },
    } satisfies LocalSettings,
    null,
    2
  );
}
