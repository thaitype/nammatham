import fs from 'node:fs';
import dotenv from 'dotenv';
import path from 'node:path';

import type { EnvVariablesConfig } from '../config-loader';

import { createDebugger } from '../utils';
import { DEFAULT_ENV_FILEs } from '../constants';

import 'dotenv/config';

export type EnvVariables = Record<string, string | undefined>;

const debug = createDebugger('nammatham:config');

export function loadUserDefinedEnvVariables(): EnvVariables {
  for (const envFile of DEFAULT_ENV_FILEs) {
    if (fs.existsSync(path.resolve(envFile))) {
      debug?.('Loading user defined environment variables from %s', envFile);
      const dataBuffer = fs.readFileSync(path.resolve(envFile));
      const config = dotenv.parse(dataBuffer); // will return an object
      return config;
    }
  }

  return {};
}

export function loadEnvVariables(config: EnvVariablesConfig): EnvVariables {
  const userEnvVariables = loadUserDefinedEnvVariables();
  if (Object.keys(userEnvVariables).length === 0 && config.enableLoadSystemEnvVariables) {
    debug?.('Loading system environment variables');
    return process.env;
  }
  return userEnvVariables;
}
