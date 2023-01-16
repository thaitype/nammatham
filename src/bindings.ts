import { AuthorizationLevel } from "./enum";

// This will use to call app.get / app.post ..... of express
export type RequestMethod = "get" | "post" | "delete" | "options" | "put";
export type BindingType = "httpTrigger" | "http";
export type BindingDiection = "in" | "out";

export interface AzureFunctionJsonConfig {
  bindings: FunctionBinding[];
  scriptFile?: string;
}

// Ref: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#configuration
export interface FunctionBinding {
  authLevel?: AuthorizationLevel;
  type: BindingType;
  direction: BindingDiection;
  name: string;
  methods?: RequestMethod[];
  route?: string;
}

export function httpTrigger(
  authLevel: AuthorizationLevel,
  methods: RequestMethod[],
  route?: string
): [FunctionBinding, FunctionBinding] {
  const requestBinding: FunctionBinding = {
    authLevel,
    type: "httpTrigger",
    direction: "in",
    name: "req",
    methods,
  };
  if(route !== undefined){
    requestBinding.route = route;
  }
  const responseBinding: FunctionBinding = {
    type: "http",
    direction: "out",
    name: "res",
  };
  return [requestBinding, responseBinding];
}
