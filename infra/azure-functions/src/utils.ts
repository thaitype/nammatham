import type { InfraEnvConfig } from './types';

export function toTarget(infraConfig: InfraEnvConfig): string {
  return `${infraConfig.runtime}${infraConfig.version}-${infraConfig.platform}-${infraConfig.arch}`;
}

export function fallbackResourceIdentifier(infraConfig: InfraEnvConfig): string {
  const hasher = new Bun.CryptoHasher('sha256');
  const hash = hasher.update(toTarget(infraConfig));
  return hash.digest('hex').slice(0, 8);
}
/**
 * Injest resource identifiers and infra configs to create infra configs
 */
export function createInfraConfig(
  resourceIdentifiers: Record<string, string | undefined>,
  infraConfigs: InfraEnvConfig[]
): InfraEnvConfig[] {
  return infraConfigs.map(infraConfig => {
    const resourceIdentifier = resourceIdentifiers[toTarget(infraConfig)];

    if (!resourceIdentifier && infraConfig.isDeployable) {
      throw new Error(
        `resourceIdentifier is required for ${toTarget(
          infraConfig
        )} due to is cannot be deployed. Please provide RESOURCE_IDENTIFIER_${toTarget(infraConfig)
          .replaceAll('-', '_')
          .toUpperCase()} in env.`
      );
    }

    return {
      ...infraConfig,
      isDeployable: infraConfig.isDeployable ?? false,
      resourceIdentifier,
    };
  });
}
