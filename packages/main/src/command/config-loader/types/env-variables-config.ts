export interface EnvVariablesConfig {
  /**
   * Load system environment variables into the Azure Functions local.settings.json file.
   *
   * @default false
   */
  enableLoadSystemEnvVariables?: boolean;
}
