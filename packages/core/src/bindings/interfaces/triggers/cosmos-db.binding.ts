import { BaseFunctionBinding } from '../base-function-binding';

/**
 * Azure Functions Cosmos DB Type
 */
export type CosmosDBType = 'cosmosDB';

interface CosmosDBBinding_Base<Name> extends BaseFunctionBinding<CosmosDBType, Name> {
  /**
   * Required - Must be set to `cosmosDB`.
   */
  type: CosmosDBType;
 /**
   * The name of the Azure Cosmos DB database with the collection being monitored.
   */
    databaseName: string;
  /** 
  (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, East US,South Central US,North Europe.
  */
  preferredLocations?: any;
}

interface CosmosDBBinding_Output_Base<Name> extends CosmosDBBinding_Base<Name> {
  direction: 'out';

  /** 
  A boolean value to indicate whether the collection is created when it doesn't exist. The default is false because new collections are created with reserved throughput, which has cost implications. For more information, see the pricing page.
  */
  createIfNotExists: boolean;
  /** 
  When createIfNotExists is true, it defines the partition key path for the created collection. May include binding parameters.
  */
  partitionKey?: string;
}

export interface CosmosDBBinding_Output_V2<Name = unknown> extends CosmosDBBinding_Output_Base<Name> {
  /** 
  The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see Connections.
  */
  connectionStringSetting: string;
  /** 
  The name of the collection being monitored.
  */
  collectionName: string;
  /** 
  When createIfNotExists is true, it defines the throughput of the created collection.
  */
  collectionThroughput?: any;
  /** 
  (Optional) When set to true along with preferredLocations, supports multi-region writes in the Azure Cosmos DB service.
  */
  useMultipleWriteLocations?: any;
}

export interface CosmosDBBinding_Output_V4<Name = unknown> extends CosmosDBBinding_Output_Base<Name> {
  /** 
  The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see Connections.
  */
  connection: string;
  /** 
  The name of the container being monitored.
  */
  containerName: string;
  /** 
  When createIfNotExists is true, it defines the throughput of the created container.
  */
  containerThroughput?: any;
}

export interface CosmosDBBinding_Input_Base<Name> extends CosmosDBBinding_Base<Name> {
  direction: 'in';
  /** 
  Specifies the partition key value for the lookup. May include binding parameters. It is required for lookups in partitioned collections.
  */
  partitionKey: string;
  /** 
  The ID of the document to retrieve. This property supports binding expressions. Don't set both the id and sqlQuery properties. If you don't set either one, the entire collection is retrieved.
  */
  id: any;
  /** 
  An Azure Cosmos DB SQL query used for retrieving multiple documents. The property supports runtime bindings, as in this example: SELECT * FROM c where c.departmentId = {departmentId}. Don't set both the id and sqlQuery properties. If you don't set either one, the entire collection is retrieved.
  */
  sqlQuery: string;
}

export interface CosmosDBBinding_Input_V2<Name = unknown> extends CosmosDBBinding_Input_Base<Name> {
  /** 
  The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see Connections.
  */
  connectionStringSetting: string;
  /** 
  The name of the collection being monitored.
  */
  collectionName: string;
}

export interface CosmosDBBinding_Input_V4<Name = unknown> extends CosmosDBBinding_Input_Base<Name> {
  /** 
  The name of an app setting or setting container that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see Connections.
  */
  connection: string;
  /** 
  The name of the container being monitored.
  */
  containerName: string;
}
