import {
  AuthorizationLevelType,
  HttpTriggerBinding,
  HttpBinding,
  RequestMethod,
} from '../';

import * as binding from '../';

/**
 * Built-in Helper,
 *
 * @param authLevel
 * @param methods
 * @param route
 * @returns
 */

export function httpTrigger(
  authLevel: AuthorizationLevelType,
  methods: RequestMethod[],
  route?: string
): [HttpTriggerBinding<'req'>, HttpBinding<'$return'>] {
  const requestBinding = binding.httpTrigger({
    name: 'req' as const,
    authLevel,
    methods,
  });
  if (route !== undefined) {
    requestBinding.route = route;
  }
  const responseBinding = binding.http({ name: '$return' as const });
  return [requestBinding, responseBinding];
}


export const AuthorizationLevel = {
  Anonymous: 'anonymous',
  Function: 'function',
  Admin: 'admin'
} as const;