import { AuthorizationLevel, FunctionBinding, RequestMethod } from '..';
import { useHelper } from './shared';

/**
 * Built-in Helper, 
 * 
 * Set `useHelper` = true, for cleaner method interface
 * @param authLevel 
 * @param methods 
 * @param route 
 * @returns 
 */
export function httpTrigger(
  authLevel: AuthorizationLevel,
  methods: RequestMethod[],
  route?: string
): [FunctionBinding<'req'>, FunctionBinding<'res'>] {
  const requestBinding: FunctionBinding<'req'> = {
    authLevel,
    type: 'httpTrigger',
    direction: 'in',
    name: 'req',
    methods,
    useHelper
  };
  if (route !== undefined) {
    requestBinding.route = route;
  }
  const responseBinding: FunctionBinding<'res'> = {
    type: 'http',
    direction: 'out',
    name: 'res',
  };
  return [requestBinding, responseBinding];
}
