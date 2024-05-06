import fs from 'node:fs';
import path from 'node:path';

import type { EnvVariables } from './load-env-vars';
import type { LocalSettings, NammathamConfigs } from '../config-loader';

export async function writeConfig(config: NammathamConfigs, envVars: EnvVariables, tmpPath = '') {
  const targetPath = path.resolve(config.buildPath ?? './nmt', tmpPath);
  await Promise.all([
    fs.promises.writeFile(path.join(targetPath, 'host.json'), constructHostConfig(config), 'utf-8'),
    fs.promises.writeFile(path.join(targetPath, 'local.settings.json'), constructLocalSettings(envVars), 'utf-8'),
  ]);
}

export function constructHostConfig(config: NammathamConfigs): string {
  return JSON.stringify(
    {
      customHandler: {
        description: {
          defaultExecutablePath: config.buildOption?.target?.platform === 'win' ? 'main.exe' : 'main',
        },
        enableForwardingHttpRequest: true,
      },
      ...config.hostConfig,
    },
    null,
    2
  );
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
