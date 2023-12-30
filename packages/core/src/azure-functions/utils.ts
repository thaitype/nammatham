import { blue, green, yellow } from 'colorette';
import { NammathamApp } from '../core/nammatham-app';
import { AzureFunctionsEndpoint } from './types';
import { trimSlash } from '../express/middleware';

function getMethods(func: AzureFunctionsEndpoint<any, any>): string[] {
  if (!Array.isArray(func.endpointOption?.methods)) {
    return [];
  }
  const methods = func.endpointOption?.methods?.map(method => method.toUpperCase()) ?? [];
  return methods;
}

function getFullUrl(func: AzureFunctionsEndpoint<any, any>, port?: number): string {
  if (typeof func.endpointOption?.route !== 'string') return '';
  return `http://localhost${port ? `:${port}` : ''}/api/${trimSlash(func.endpointOption?.route)}`;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function printRegisteredFunctions(app: NammathamApp, port?: number) {
  const azureFunctions = app.functions.filter(func => func.type === 'azureFunctions') as AzureFunctionsEndpoint<any, any>[];
  if(azureFunctions.length === 0) return;
  await delay(200);
  console.log(`\n${yellow('Functions:')}\n`);
  for (const func of azureFunctions) {
    const methods = `[${getMethods(func).join(',')}]`;
    console.log(`\t${yellow(func.name)}: ${blue(methods)} ${green(getFullUrl(func, port))}\n`);
  }
  console.log('');
}
