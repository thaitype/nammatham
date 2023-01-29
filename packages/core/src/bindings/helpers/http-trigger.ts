import { AuthorizationLevel, FunctionBinding, RequestMethod } from '../';

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
