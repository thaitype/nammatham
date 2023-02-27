import { BaseFunctionBinding } from '../base-function-binding';

/**
 * Azure Functions ServiceBusTrigger Type
 */
export type ServiceBusTriggerType = 'serviceBusTrigger';

/**
 * ServiceBusTrigger Binding
 *
 * read more: [ServiceBusTrigger Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#configuration)
 */
export interface ServiceBusTriggerBinding<Name = unknown> extends BaseFunctionBinding<ServiceBusTriggerType, Name> {
  type: ServiceBusTriggerType;
  /**
   * ServiceBusTrigger requires direction `in`
   */
  direction: 'in';

  /** 
  Name of the queue to monitor. Set only if monitoring a queue, not for a topic.
  */
  queueName?: string;
  /** 
  Name of the topic to monitor. Set only if monitoring a topic, not for a queue.
  */
  topicName?: string;
  /** 
  Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.
  */
  subscriptionName?: string;
  /** 
  The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#connections).
  */
  connection?: string;
  /** 
  Access rights for the connection string. Available values are `manage` and `listen`. 
  The default is `manage`, which indicates that the `connection`has the **Manage**
  permission. If you use a connection string that does not have the **Manage**
  permission, set `accessRights`to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.
  */
  accessRights?: string;
  /** 
  `true` if connecting to a session-aware queue or subscription. false otherwise, which is the default value.
  */
  isSessionsEnabled?: boolean;
  /** 
  `Must` be true for non-C# functions, which means that the trigger should either automatically call complete after processing, or the function code manually calls complete.

  When set to `true`, the trigger completes the message automatically if the function execution completes successfully, and abandons the message otherwise.

  Exceptions in the function results in the runtime calls `abandonAsync` in the background. If no exception occurs, then `completeAsync` is called in the background. This property is available only in Azure Functions 2.x and higher.
  */
  autoComplete?: boolean;
}

/**
 * ContextBindingData for Service Bus Trigger [Ref](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#example)
 */

export interface ServiceBusTriggerContextBindingData {
  /**
   * Enqueue Time UTC
   */
  enqueuedTimeUtc: any;

  /**
   * Delivery Count
   */
  deliveryCount: any;

  /**
   * Message ID
   */
  messageId: any;
}
