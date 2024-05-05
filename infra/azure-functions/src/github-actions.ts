import * as core from '@actions/core';

import type { InfraEnvConfig } from './types';

import { toTarget } from './utils';
import { infraConfigs } from './config';

export interface GithubActionsMatrix {
  os: string;
  /**
   * Node or Bun
   */
  runtime: 'node' | 'bun';
  /**
   * Node or Bun version
   */
  version: string;
  /**
   * target runtime
   */
  target: string;
}

/**
 * Select github actions runner
 *
 * @ref https://github.com/actions/runner-images
 *
 * - when platform is `linux` (x64), use [ubuntu-latest](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2204-Readme.md)
 * - when platform is `windows` (x64), use [windows-latest](https://github.com/actions/runner-images/blob/main/images/windows/Windows2022-Readme.md)
 * - when platform is `macos` (arm64), use [macos-latest](https://github.com/actions/runner-images/blob/main/images/macos/macos-14-arm64-Readme.md)
 */

export function toGithubActionsMatrix(configs: InfraEnvConfig[]): GithubActionsMatrix[] {
  return configs.map(config => {
    const { platform, runtime } = config;
    const version = runtime === 'node18' ? '18' : 'latest';

    return {
      os: platform === 'linux' ? 'ubuntu-latest' : platform === 'win' ? 'windows-latest' : 'macos-latest',
      runtime: runtime === 'bun' ? 'bun' : 'node',
      version,
      target: toTarget(config),
    } satisfies GithubActionsMatrix;
  });
}

const matrix = toGithubActionsMatrix(infraConfigs);
console.log('Github Actions Matrix', JSON.stringify(matrix, null, 2));
core.setOutput('matrix', JSON.stringify(matrix));
