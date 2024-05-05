import type { BundleCodeOptions } from './build';
import type { EnvVariablesConfig, HostConfigV2, LocalSettings } from './config-loader';

export interface NammathamConfigs {
  /**
   * The path to the build directory.
   * Add this path into .gitignore file, this will help to avoid the unnecessary files to be pushed to the repository.
   *
   * @default '.nmt'
   */
  buildPath?: string;
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
   * Bundle the code using esbuild
   */
  buildOption?: BundleCodeOptions;
}
