import { AuthorizationLevel } from "./enum";

// This will use to call app.get / app.post ..... of express
export type RequestMethod = "get" | "post" | "delete" | "options" | "put";
export type BindingType = "httpTrigger" | "http";
export type BindingDiection = "in" | "out";

export interface FunctionBinding {
  authLevel?: AuthorizationLevel;
  type: BindingType;
  direction: BindingDiection;
  name: string;
  methods?: RequestMethod[];
}

export function httpTrigger(
  authLevel: AuthorizationLevel,
  methods: RequestMethod[]
): [FunctionBinding, FunctionBinding] {
  return [
    {
      authLevel,
      type: "httpTrigger",
      direction: "in",
      name: "req",
      methods,
    },
    {
      type: "http",
      direction: "out",
      name: "res",
    },
  ];
}
