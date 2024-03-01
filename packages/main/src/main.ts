import { createInitNammatham } from '@nammatham/core';
import { AzureFunctionsAdapter } from '@nammatham/azure-functions';

export * from '@nammatham/core';
export * from '@nammatham/express';
export * from '@nammatham/azure-functions';

/**
 * Initialize Nammatham with the default adapter for Azure Functions
 */
export const initNammatham = createInitNammatham(new AzureFunctionsAdapter())
