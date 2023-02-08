import { AuthorizationLevel, Binding, RequestMethod } from '../';

/**
 * Built-in Helper,
 *
 * @param authLevel
 * @param methods
 * @param route
 * @returns
 */
export function httpTrigger(authLevel: AuthorizationLevel, methods: RequestMethod[], route?: string) {
  const requestBinding = Binding.httpTriggerRequest({
    name: 'req' as const,
    authLevel,
    methods,
  });
  if (route !== undefined) {
    requestBinding.route = route;
  }
  const responseBinding = Binding.httpTriggerResponse({ name: 'res' as const });
  return [requestBinding, responseBinding];
}
