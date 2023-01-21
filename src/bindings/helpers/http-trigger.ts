import { AuthorizationLevel, FunctionBinding, RequestMethod } from "../";

export function httpTrigger(
    authLevel: AuthorizationLevel,
    methods: RequestMethod[],
    route?: string
  ): [FunctionBinding, FunctionBinding] {
    const requestBinding: FunctionBinding = {
      authLevel,
      type: 'httpTrigger',
      direction: 'in',
      name: 'req',
      methods,
    };
    if (route !== undefined) {
      requestBinding.route = route;
    }
    const responseBinding: FunctionBinding = {
      type: 'http',
      direction: 'out',
      name: 'res',
    };
    return [requestBinding, responseBinding];
  }
  