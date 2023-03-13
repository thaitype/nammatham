export * from './http';
export * from './logger';

/**
 * Re-export InvocationContext
 */
import * as type from '@azure/functions';
export type InvocationContext = type.InvocationContext;