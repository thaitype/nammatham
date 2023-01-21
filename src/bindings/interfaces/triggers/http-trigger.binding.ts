import { BaseFunctionBinding } from "../base-function-binding";

export type RequestMethod = 'get' | 'post' | 'delete' | 'options' | 'put';
export enum AuthorizationLevel {
  Anonymous = 'anonymous'
}
/**
 * HttpTrigger Binding
 * Configuration Doc: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#configuration
 */
export interface HttpTriggerRequestBinding extends BaseFunctionBinding {
    /**
     * Required - must be set to `httpTrigger`.
     */
    type: 'httpTrigger',
    /**
     * Required - must be set to in.
     */
    direction: 'in',
    authLevel?: AuthorizationLevel;
    methods?: RequestMethod[];
    route?: string;
  }
  
  export interface HttpTriggerResponseBinding extends BaseFunctionBinding {
    type: 'http',
    direction: 'out',
  }
  