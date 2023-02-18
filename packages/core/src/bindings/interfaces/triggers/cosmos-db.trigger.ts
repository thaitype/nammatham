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

export interface CosmosDBTriggerBinding_v2<T> extends CosmosDBTriggerBinding_Base<T> {
  /**
   * The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#connections).
   */
  connectionStringSetting: string;
  /**
   * The name of the collection being monitored.
   */
  collectionName: string;
}

export interface CosmosDBTriggerBinding_v4<T> extends CosmosDBTriggerBinding_Base<T> {
  /**
   * The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#connections).
   */
  connection: string;

  /**
   * The name of the container being monitored.
   */
  containerName: string;
}
