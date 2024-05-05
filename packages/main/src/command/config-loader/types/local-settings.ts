export type Dictionary = Record<string, string>;

export interface LocalSettings {
  IsEncrypted?: boolean;
  Values?: LocalSettingsValues;
  ConnectionStrings?: Dictionary;
}

export interface LocalSettingsValues extends Dictionary {
  /**
   * The function worker runtime should be set to 'custom' for custom handlers.
   * Required for custom handlers on Nammatham.
   * @default 'custom'
   */
  FUNCTIONS_WORKER_RUNTIME: 'custom';
  /**
   * The AzureWebJobsStorage connection string.
   *
   * @default 'UseDevelopmentStorage=true' for local development.
   */
  AzureWebJobsStorage: string;
}
