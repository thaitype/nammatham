import fs from 'node:fs';
import dotenv from 'dotenv';
import path from 'node:path';

import { DEFAULT_ENV_FILEs } from '../constants';

import 'dotenv/config';

export type EnvVariables = Record<string, string | undefined>;

export function loadUserDefinedEnvVariables(): EnvVariables {
  for (const envFile of DEFAULT_ENV_FILEs) {
    if (fs.existsSync(path.resolve(envFile))) {
      const dataBuffer = fs.readFileSync(path.resolve(envFile));
      const config = dotenv.parse(dataBuffer); // will return an object
      return config;
    }
  }

  return {};
}

export function loadEnvVariables(): EnvVariables {
  const userEnvVariables = loadUserDefinedEnvVariables();
  if (Object.keys(userEnvVariables).length === 0) {
    return process.env;
  }
  return userEnvVariables;
}
