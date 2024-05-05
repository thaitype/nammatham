import { $ } from 'bun';

import type { InfraEnvConfig } from './types';

import { fallbackResourceIdentifier, toTarget } from './utils';

export function getResourceName(infraConfig: InfraEnvConfig): { prefix: string; shortPrefix: string } {
  const shortResourceIdentifier =
    infraConfig.resourceIdentifier?.slice(0, 8) ?? fallbackResourceIdentifier(infraConfig);
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

export async function createFunctionApp(infraConfig: InfraEnvConfig) {
  const resourceName = getResourceName(infraConfig);
  console.log('Creating function app');

  const location = 'eastasia';
  const resourceGroup = `rg-nammatham-${resourceName.prefix}`;
  const skuStorage = 'Standard_LRS';
  const functionsVersion = '4';
  if (infraConfig.platform !== 'linux' && infraConfig.platform !== 'win') {
    throw new Error(`Unsupported platform: ${infraConfig.platform}`);
  }
  const osType = infraConfig.platform === 'linux' ? 'Linux' : 'Windows';

  //   # Create a resource group
  // echo "Creating $resourceGroup in "$location"..."
  // az group create --name $resourceGroup --location "$location" --tags $tag

  // # Create an Azure storage account in the resource group.
  // echo "Creating $AZURE_STORAGE_ACCOUNT"
  // az storage account create --name $AZURE_STORAGE_ACCOUNT --location "$location" --resource-group $resourceGroup --sku $skuStorage

  // # Set the storage account key as an environment variable.
  // # export AZURE_STORAGE_KEY=$(az storage account keys list -g $resourceGroup -n $AZURE_STORAGE_ACCOUNT --query '[0].value' -o tsv)

  // # Create a serverless function app in the resource group.
  // echo "Creating $functionApp"
  // az functionapp create --name $functionApp --storage-account $AZURE_STORAGE_ACCOUNT --consumption-plan-location "$location" --resource-group $resourceGroup --os-type Linux --runtime custom --functions-version $functionsVersion

  console.log(`Creating ${resourceGroup} in ${location}...`);
  await $`az group create --name ${resourceGroup} --location ${location}`;

  console.log(`Creating storage account: ${resourceName.shortPrefix}`);
  await $`az storage account create --name ${resourceName.shortPrefix} --location ${location} --resource-group ${resourceGroup} --sku ${skuStorage}`;

  console.log(`Creating function app: ${resourceName.prefix}`);
  await $`az functionapp create --name ${resourceName.prefix} --storage-account ${resourceName.shortPrefix} --consumption-plan-location ${location} --resource-group ${resourceGroup} --os-type ${osType} --runtime custom --functions-version ${functionsVersion}`;

  console.log('Function app created');
}

export async function destroyFunctionApp(infraConfig: InfraEnvConfig) {
  const resourceName = getResourceName(infraConfig);
  console.log('Destroying function app');

  const resourceGroup = `rg-nammatham-${resourceName.prefix}`;

  console.log(`Deleting ${resourceGroup}`);
  await $`az group delete --name ${resourceGroup} --yes`;
}
