import type { TargetOptions } from 'nammatham';

export interface InfraEnvConfig extends TargetOptions {
  /**
   * Each infra config will be tested for build of specific target options
   * Some infra configs may not be deployable, so we can skip them
   *
   * This setting controls deploy process and creates a function app
   *
   * @default false
   */
  isDeployable?: boolean;

  /**
   * Resource identifier
   */
  resourceIdentifier?: string;
}
