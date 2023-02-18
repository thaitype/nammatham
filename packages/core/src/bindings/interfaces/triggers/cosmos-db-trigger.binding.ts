import { BaseFunctionBinding } from '../base-function-binding';

/**
 * Azure Functions Cosmos DB Trigger Type
 */
export type CosmosDBTriggerType = 'cosmosDBTrigger';

export interface CosmosDBTriggerBinding_Base<T> extends BaseFunctionBinding<CosmosDBTriggerType, T> {
  /**
   * Required - Must be set to `cosmosDBTrigger`.
   */
  type: CosmosDBTriggerType;
  /**
   * The name of the Azure Cosmos DB database with the collection being monitored.
   */
  databaseName: string;
}

/**
 * CosmosDBTrigger Type v2 with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 */

export interface CosmosDBTriggerInputBinding_v2<T> extends CosmosDBTriggerBinding_Base<T> {
  direction: 'in',
  /**
   * The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#connections).
   */
  connectionStringSetting: string;
  /**
   * The name of the collection being monitored.
   */
  collectionName: string;

  /** 
  (Optional) The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account that holds the lease collection.

  When not set, the connectionStringSetting value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases collection must have write permissions.
  */
  leaseConnectionStringSetting?: any;
  /** 
  (Optional) The name of the database that holds the collection used to store leases. When not set, the value of the databaseName setting is used.
  */
  leaseDatabaseName?: any;
  /** 
  (Optional) The name of the collection used to store leases. When not set, the value leases is used.
  */
  leaseCollectionName?: any;
  /** 
  (Optional) When set to true, the leases collection is automatically created when it doesn't already exist. The default value is false.
  */
  createLeaseCollectionIfNotExists?: any;
  /** 
  (Optional) Defines the number of Request Units to assign when the leases collection is created. This setting is only used when createLeaseCollectionIfNotExists is set to true. This parameter is automatically set when the binding is created using the portal.
  */
  leasesCollectionThroughput?: any;
  /** 
  (Optional) When set, the value is added as a prefix to the leases created in the Lease collection for this function. Using a prefix allows two separate Azure Functions to share the same Lease collection by using different prefixes.
  */
  leaseCollectionPrefix?: any;
  /** 
  (Optional) The time (in milliseconds) for the delay between polling a partition for new changes on the feed, after all current changes are drained. Default is 5,000 milliseconds, or 5 seconds.
  */
  feedPollDelay?: any;
  /** 
  (Optional) When set, it defines, in milliseconds, the interval to kick off a task to compute if partitions are distributed evenly among known host instances. Default is 13000 (13 seconds).
  */
  leaseAcquireInterval?: any;
  /** 
  (Optional) When set, it defines, in milliseconds, the interval for which the lease is taken on a lease representing a partition. If the lease is not renewed within this interval, it will cause it to expire and ownership of the partition will move to another instance. Default is 60000 (60 seconds).
  */
  leaseExpirationInterval?: any;
  /** 
  (Optional) When set, it defines, in milliseconds, the renew interval for all leases for partitions currently held by an instance. Default is 17000 (17 seconds).
  */
  leaseRenewInterval?: any;
  /** 
  (Optional) When set, it defines, in milliseconds, the interval between lease checkpoints. Default is always after each Function call.
  */
  checkpointInterval?: any;
  /** 
  (Optional) Customizes the amount of documents between lease checkpoints. Default is after every function call.
  */
  checkpointDocumentCount?: any;
  /** 
  (Optional) When set, this property sets the maximum number of items received per Function call. If operations in the monitored collection are performed through stored procedures, transaction scope is preserved when reading items from the change feed. As a result, the number of items received could be higher than the specified value so that the items changed by the same transaction are returned as part of one atomic batch.
  */
  maxItemsPerInvocation?: any;
  /** 
  (Optional) This option tells the Trigger to read changes from the beginning of the collection's change history instead of starting at the current time. Reading from the beginning only works the first time the trigger starts, as in subsequent runs, the checkpoints are already stored. Setting this option to true when there are leases already created has no effect.
  */
  startFromBeginning?: any;
  /** 
  (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, East US,South Central US,North Europe.
  */
  preferredLocations?: any;
  /** 
  (Optional) Enables multi-region accounts for writing to the leases collection.
  */
  useMultipleWriteLocations?: any;
}

/**
 * CosmosDBTrigger Type v4 with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 */
export interface CosmosDBTriggerInputBinding_v4<T> extends CosmosDBTriggerBinding_Base<T> {
  direction: 'in',
  /**
   * The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#connections).
   */
  connection: string;

  /**
   * The name of the container being monitored.
   */
  containerName: string;

  /** 
  (Optional) The name of an app setting or setting container that specifies how to connect to the Azure Cosmos DB account that holds the lease container.

  When not set, the connection value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases container must have write permissions.
  */
  leaseConnection?: any;
  /** 
  (Optional) The name of the database that holds the container used to store leases. When not set, the value of the databaseName setting is used.
  */
  leaseDatabaseName?: any;
  /** 
  (Optional) The name of the container used to store leases. When not set, the value leases is used.
  */
  leaseContainerName?: any;
  /** 
  (Optional) When set to true, the leases container is automatically created when it doesn't already exist. The default value is false. When using Azure AD identities if you set the value to true, creating containers is not an allowed operation and your Function won't be able to start.
  */
  createLeaseContainerIfNotExists?: any;
  /** 
  (Optional) Defines the number of Request Units to assign when the leases container is created. This setting is only used when createLeaseContainerIfNotExists is set to true. This parameter is automatically set when the binding is created using the portal.
  */
  leasesContainerThroughput?: any;
  /** 
  (Optional) When set, the value is added as a prefix to the leases created in the Lease container for this function. Using a prefix allows two separate Azure Functions to share the same Lease container by using different prefixes.
  */
  leaseContainerPrefix?: any;
  /** 
  (Optional) The time (in milliseconds) for the delay between polling a partition for new changes on the feed, after all current changes are drained. Default is 5,000 milliseconds, or 5 seconds.
  */
  feedPollDelay?: any;
  /** 
  (Optional) When set, it defines, in milliseconds, the interval to kick off a task to compute if partitions are distributed evenly among known host instances. Default is 13000 (13 seconds).
  */
  leaseAcquireInterval?: any;
  /** 
  (Optional) When set, it defines, in milliseconds, the interval for which the lease is taken on a lease representing a partition. If the lease is not renewed within this interval, it will cause it to expire and ownership of the partition will move to another instance. Default is 60000 (60 seconds).
  */
  leaseExpirationInterval?: any;
}
