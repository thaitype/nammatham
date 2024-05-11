import { $ } from 'bun';

import type { InfraEnvConfig, InfraOptions } from './types';

import { fallbackResourceIdentifier, toTarget } from './utils';

export function getResourceName(infraConfig: InfraEnvConfig): { prefix: string; shortPrefix: string } {
  const shortResourceIdentifier =
    infraConfig.resourceIdentifier?.slice(0, 14) ?? fallbackResourceIdentifier(infraConfig);
  const resourceNamePrefix = `nmt-e2e-${toTarget(infraConfig)}-${shortResourceIdentifier}`;
  const resourceShortNamePrefix = `nmt${shortResourceIdentifier}`.toLowerCase();
  /**
   * Azure Storage Accounts allows Lowercase letters and numbers, with a length of 3-24 characters
   */
  if (resourceShortNamePrefix.length > 24) {
    throw new Error(`Short Resource name prefix is too long: ${resourceShortNamePrefix}`);
  }
  return {
    prefix: resourceNamePrefix,
    shortPrefix: resourceShortNamePrefix,
  };
}

export async function createFunctionApp(infraConfig: InfraEnvConfig, options: InfraOptions) {
  const resourceName = getResourceName(infraConfig);
  console.log('-'.repeat(80));

  const location = 'eastasia';
  const resourceGroup = `rg-nammatham-${resourceName.prefix}`;
  const skuStorage = 'Standard_LRS';
  const functionsVersion = '4';
  if (infraConfig.platform !== 'linux' && infraConfig.platform !== 'win') {
    throw new Error(`Unsupported platform: ${infraConfig.platform}`);
  }
  const osType = infraConfig.platform === 'linux' ? 'Linux' : 'Windows';

  if (options.isPlanMode) {
    console.log('Plan mode enabled, skipping resource creation');
    return;
  }
  console.log('Creating function app');

  console.log(`Creating ${resourceGroup} in ${location}...`);
  await $`az group create --name ${resourceGroup} --location ${location}`;

  console.log(`Creating storage account: ${resourceName.shortPrefix}`);
  await $`az storage account create --name ${resourceName.shortPrefix} --location ${location} --resource-group ${resourceGroup} --sku ${skuStorage}`;

  console.log(`Creating function app: ${resourceName.prefix}`);
  await $`az functionapp create --name ${resourceName.prefix} --storage-account ${resourceName.shortPrefix} --consumption-plan-location ${location} --resource-group ${resourceGroup} --os-type ${osType} --runtime custom --functions-version ${functionsVersion}`;

  console.log(`Set Function Key for ${resourceName.prefix} `);
  await $`az functionapp keys set --name ${resourceName.prefix} --resource-group ${resourceGroup} --key-name github_actions --key-type functionKeys --key-value ${process.env.AZURE_FUNCTIONS_API_KEY}`;

  console.log('Function app created');
  console.log('-'.repeat(80));
}

export async function assignRoleAssignment(infraConfig: InfraEnvConfig, options: InfraOptions) {
  const resourceName = getResourceName(infraConfig);
  console.log('-'.repeat(80));

  if (options.isPlanMode) {
    console.log('Plan mode enabled, skipping resource creation');
    return;
  }
  console.log('Assigning role assignment');

  const resourceGroup = `rg-nammatham-${resourceName.prefix}`;
  const role = 'Contributor';
  const assignee = process.env.AZURE_APPLICATION_ID;
  const scope = `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${resourceGroup}`;
  await $`az role assignment create --role ${role} --assignee ${assignee} --scope ${scope}`;
}

export async function destroyFunctionApp(infraConfig: InfraEnvConfig, options: InfraOptions) {
  console.log('-'.repeat(80));
  const resourceName = getResourceName(infraConfig);

  if (options.isPlanMode) {
    console.log('Plan mode enabled, skipping resource creation');
    return;
  }
  console.log('Destroying function app');

  const resourceGroup = `rg-nammatham-${resourceName.prefix}`;

  console.log(`Deleting ${resourceGroup}`);
  await $`az group delete --name ${resourceGroup} --yes`;
  console.log('-'.repeat(80));
}
