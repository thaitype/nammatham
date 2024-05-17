import fs from 'node:fs';
import path from 'node:path';

import type { EnvVariables } from '../config';
import type { NammathamConfigs } from '../config-loader';

import { createDebugger } from '../utils';
import { constructHostConfig, constructLocalSettings } from '../config';

const debug = createDebugger('nammatham:dev');

export async function writeConfig(config: NammathamConfigs, envVars: EnvVariables, tmpPath = '') {
  fs.mkdirSync(path.resolve(config.buildPath ?? './nmt', tmpPath), { recursive: true });
  const targetPath = path.resolve(config.buildPath ?? './nmt', tmpPath);
  const result = await Promise.allSettled([
    fs.promises.writeFile(path.join(targetPath, 'host.json'), constructHostConfig(config, 'dev'), 'utf-8'),
    fs.promises.writeFile(path.join(targetPath, 'local.settings.json'), constructLocalSettings(envVars), 'utf-8'),
  ]);
  result.forEach(r => {
    if (r.status === 'rejected') {
      throw new Error(r.reason);
    }
  });
}
