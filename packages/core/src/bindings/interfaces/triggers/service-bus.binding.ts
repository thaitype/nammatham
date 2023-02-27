import { BaseFunctionBinding } from '../base-function-binding';

/**
 * Azure Functions ServiceBus Type
 */
export type ServiceBusType = 'serviceBus';

/**
 * ServiceBus Binding
 *
 * read more: [ServiceBus Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-output?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#configuration)
 */
export interface ServiceBusBinding_Output<Name = unknown> extends BaseFunctionBinding<ServiceBusType, Name> {
  type: ServiceBusType;
  /**
   * ServiceBus requires direction `in`
   */
  direction: 'out';

  /** 
  Name of the queue. Set only if sending queue messages, not for a topic.
  */
  queueName?: string;
  /** 
  Name of the topic. Set only if sending topic messages, not for a queue.
  */
  topicName?: string;
  /** 
  The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-output?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#connections).
  */
  connection?: string;
}
