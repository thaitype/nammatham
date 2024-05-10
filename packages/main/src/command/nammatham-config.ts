import type { EnvVariablesConfig, HostConfigV2, LocalSettings } from './config-loader';

import { getHostTarget, type BuildOptions } from './build';

export interface NammathamConfigs {
  /**
   * The path to the build directory.
   * Add this path into .gitignore file, this will help to avoid the unnecessary files to be pushed to the repository.
   *
   * @default '.nmt'
   */
  buildPath?: string;
  /**
   * The route prefix for the HTTP trigger functions.
   * TODO: the config will read from `Nammatham` class that define in the code first, if not found then it will use this config.
   *
   * @default 'api'
   */
  routePrefix?: string;
  /**
   * Azure Functions Host.json Configuration
   *
   * @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json
   */
  hostConfig?: HostConfigV2;

  /**
   * Local settings for Azure Functions (local.settings.json)
   *
   * Overrides the local settings in the local.settings.json file.
   * Typically used for local development, however, most of the time the you don't need to override the local settings.
   * The framework will automatically load config from .env file into local.settings.json.
   *
   * This is useful when you want to override the local settings for local development directly from the nammatham.config.ts file.
   */
  localSettings?: LocalSettings;
  /**
   * Environment variables Config, it is to be loaded into the Azure Functions local.settings.json file.
   */
  envVariablesConfig?: EnvVariablesConfig;

  /**
   * Build options including build, bundle, and package a single executable file.
   */
  buildOptions?: BuildOptions;
  /**
   * The runtime environment for the Azure Functions.
   *
   * @default 'bun'
   */
  runtime?: 'node' | 'bun';
}

const defaultRoutePrefix = 'api';
export const defaultNammathamConfigs: NammathamConfigs = {
  buildPath: '.nmt',
  runtime: 'bun',
  routePrefix: defaultRoutePrefix,
  hostConfig: {
    version: '2.0',
    extensionBundle: {
      id: 'Microsoft.Azure.Functions.ExtensionBundle',
      version: '[4.0.0, 5.0.0)',
    },
    extensions: {
      http: {
        routePrefix: defaultRoutePrefix,
      },
    },
  },
  buildOptions: {
    disabled: false,
    target: getHostTarget(),
    nodeToolChain: {
      dev: 'tsx',
      bundle: 'esbuild',
      package: 'pkg',
    },
  },
};
