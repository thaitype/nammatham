import type { AfterServerStartedMetadata, NammathamApp } from '@nammatham/core';

import { gray, yellow } from 'colorette';
import { trimSlash } from '@nammatham/core';

import type { AzureFunctionsEndpoint } from './types';

export function getMethods(func: AzureFunctionsEndpoint<unknown, unknown>): string[] {
  if (!Array.isArray(func.endpointOption?.methods)) {
    return [];
  }
  const methods = func.endpointOption?.methods?.map(method => method.toUpperCase()) ?? [];
  return methods;
}

export function getFullUrl(func: AzureFunctionsEndpoint<unknown, unknown>, hostname: string, port?: number): string {
  const endpoint = func.endpointOption?.route ?? func.name;
  if (typeof endpoint !== 'string') return '';
  return `http://${hostname}${port ? `:${port}` : ''}/api/${trimSlash(endpoint)}`;
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function printRegisteredFunctions(
  app: NammathamApp,
  option: AfterServerStartedMetadata
): Promise<AzureFunctionsEndpoint<unknown, unknown>[]> {
  const azureFunctions = app.functions
    .filter(func => func.type === 'azure-functions')
    .filter(func => func.endpointOption?.type === 'http') as AzureFunctionsEndpoint<unknown, unknown>[];
  if (azureFunctions.length === 0) return [];
  console.log(`\n${yellow('Functions:')}\n`);
  for (const func of azureFunctions) {
    const methods = `[${getMethods(func).join(',')}]`;
    console.log(` - ${func.name} ${gray(methods)} ${gray(getFullUrl(func, option.hostname, option.port))}`);
  }
  return azureFunctions;
}

/**
 * FIXME: This functions is duplicated with printRegisteredFunctions, it should be merged later.
 */
export async function printRegisteredNonHttpFunctions(
  app: NammathamApp,
  option: AfterServerStartedMetadata
): Promise<AzureFunctionsEndpoint<unknown, unknown>[]> {
  const azureFunctions = app.functions
    .filter(func => func.type === 'azure-functions')
    .filter(func => func.endpointOption?.type !== 'http') as AzureFunctionsEndpoint<unknown, unknown>[];
  if (azureFunctions.length === 0) return [];
  console.log(`\n${yellow('Non-HTTP Functions, accessed by HTTP (dev mode):')}\n`);
  for (const func of azureFunctions) {
    // const type = `[${func.endpointOption?.type ?? 'generic'}]`;
    console.log(` - ${func.name} ${gray(getFullUrl(func, option.hostname, option.port))}`);
  }
  return azureFunctions;
}
