import { blue, green, underline, yellow } from 'colorette';
import { NammathamApp } from '../../nammatham-app';
import { AzureFunctionsEndpoint } from './types';
import { trimSlash } from '../../../servers/adapters/express';

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
  await delay(200);
  console.log(`\n${yellow('Functions:')}\n`);
  for (const func of app.functions) {
    if (func.type !== 'azureFunctions') continue;
    const methods = `[${getMethods(func).join(',')}]`;
    console.log(`\t${yellow(func.name)}: ${blue(methods)} ${green(getFullUrl(func, port))}\n`);
  }
}
