import type { InfraEnvConfig } from './types';

export function toTarget(infraConfig: InfraEnvConfig): string {
  return `${infraConfig.runtime}-${infraConfig.platform}-${infraConfig.arch}`;
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
    const resourceIdentifier: string =
      resourceIdentifiers[toTarget(infraConfig)] ?? fallbackResourceIdentifier(infraConfig);

    return {
      ...infraConfig,
      isDeployable: infraConfig.isDeployable ?? false,
      resourceIdentifier,
    };
  });
}
