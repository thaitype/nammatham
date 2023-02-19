import { AuthorizationLevelType, HttpTriggerBinding, HttpBinding, Binding, RequestMethod } from '../';

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
  const requestBinding = Binding.httpTrigger({
    name: 'req' as const,
    authLevel,
    methods,
  });
  if (route !== undefined) {
    requestBinding.route = route;
  }
  const responseBinding = Binding.http({ name: '$return' as const });
  return [requestBinding, responseBinding];
}
