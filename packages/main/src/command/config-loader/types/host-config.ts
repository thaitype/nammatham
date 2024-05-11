/**
 * Function Host Configuration v2
 *
 * Host configuration settings for an Azure Functions host.
 * @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json
 * @ref https://github.com/Azure/azure-functions-host/wiki/host.json-(v2)
 * @ref Custom Handler: https://learn.microsoft.com/en-us/azure/azure-functions/functions-custom-handlers
 */

export interface HostConfigV2 {
  /** Specifies the version of the function host settings file. */
  version: '2.0';
  /** Settings related to function execution aggregators. */
  aggregator?: Aggregator;
  /** Concurrency settings for the function app. */
  concurrency?: Concurrency;
  /** Contains configurations for various extensions used within the function app. */
  extensions?: Extensions;
  customHandler?: CustomHandler;
  /**
   * Defines the extension bundle to use with the function app.
   * The default value using [v4.x of the Azure Functions extension bundle](https://github.com/Azure/azure-functions-extension-bundles/blob/v4.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json).
   *
   *
   * @ref https://github.com/Azure/azure-functions-extension-bundles
   * @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register#extension-bundles
   *
   * @default { id: 'Microsoft.Azure.Functions.ExtensionBundle', version: '[4.0.0, 5.0.0)'}
   **/
  extensionBundle?: ExtensionBundle;
  /** A list of functions to load, if not all functions should be loaded. */
  functions?: string[];
  /** Maximum duration a function is allowed to run before being terminated. */
  functionTimeout?: string;
  /** Configurations for monitoring the health of the function app. */
  healthMonitor?: HealthMonitor;
  /** Contains settings related to logging and log storage. */
  logging?: Logging;
  /** Configuration for managing dependencies automatically. */
  managedDependency?: ManagedDependency;
  /** Settings specific to singleton function execution. */
  singleton?: Singleton;
  /** Directories to watch for changes which would trigger a function app restart. */
  watchDirectories?: string[];
  /** Specific files to watch for changes which would trigger a function app restart. */
  watchFiles?: string[];
}

/** Aggregator settings for function executions. */
export interface Aggregator {
  /** The maximum number of events in a batch before it is processed. */
  batchSize?: number;
  /** The time after which the batch will be processed if not full. */
  flushTimeout?: string;
}

/** Concurrency management settings for functions. */
export interface Concurrency {
  /** Enables dynamic adjustment of concurrency based on system performance. */
  dynamicConcurrencyEnabled?: boolean;
  /** Enables persistence of concurrency information between function app restarts. */
  snapshotPersistenceEnabled?: boolean;
}

/** Configurations for all extensions used in the function app. */
export interface Extensions {
  /** Configuration for blob storage bindings and triggers. */
  blobs?: Blobs;
  /** Configuration for durable functions. */
  durableTask?: DurableTask;
  /** Configuration for Cosmos DB bindings and triggers. */
  cosmosDB?: CosmosDb;
  /** Configuration for SendGrid bindings used for sending emails. */
  sendGrid?: SendGrid;
  /** Configuration settings for HTTP trigger behaviors. */
  http?: Http;
  /** Configuration settings for queue storage bindings and triggers. */
  queues?: Queues;
  /** Configuration settings for Event Hubs bindings and triggers. */
  eventHubs?: EventHubs;
  /** Configuration settings for Service Bus bindings and triggers. */
  serviceBus?: ServiceBus;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Blobs {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DurableTask {}

export interface CosmosDb {
  connectionMode?: string;
  protocol?: string;
  leaseOptions?: LeaseOptions;
}

export interface LeaseOptions {
  leasePrefix?: string;
}

export interface SendGrid {
  from?: string;
}

export interface Http {
  routePrefix?: string;
  maxConcurrentRequests?: number;
  maxOutstandingRequests?: number;
}

export interface Queues {
  visibilityTimeout?: string;
  maxPollingInterval?: string;
  maxDequeueCount?: number;
}

export interface EventHubs {
  batchCheckpointFrequency?: number;
  eventProcessorOptions?: EventProcessorOptions;
}

export interface EventProcessorOptions {
  maxBatchSize?: number;
  prefetchCount?: number;
}

export interface ServiceBus {
  prefetchCount?: number;
  messageHandlerOptions?: MessageHandlerOptions;
}

export interface MessageHandlerOptions {
  maxConcurrentCalls?: number;
  maxAutoRenewDuration?: string;
}

export interface CustomHandler {
  description?: Description;
  /**
   * When enableForwardingHttpRequest is true, the behavior of HTTP-only functions differs from the default custom handlers behavior in these ways:

      1. The HTTP request does not contain the custom handlers request payload. Instead, the Functions host invokes the handler with a copy of the original HTTP request.
      2. The Functions host invokes the handler with the same path as the original request including any query string parameters.
      3. The Functions host returns a copy of the handler's HTTP response as the response to the original request.

      @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-custom-handlers#implementation-1
   */
  enableForwardingHttpRequest?: boolean;
}

export interface Description {
  defaultExecutablePath?: string;
  arguments?: string[];
  workingDirectory?: string;
}

/**
 * Extension Bundle
 * @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register#extension-bundles
 */
export interface ExtensionBundle {
  /**
   * The namespace for Microsoft Azure Functions extension bundles.
   *
   * @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register#extension-bundles
   * @default 'Microsoft.Azure.Functions.ExtensionBundle'
   */
  id?: string;
  /**
   * The version range of the bundle to install. The Functions runtime always picks the maximum permissible version defined by the version range or interval.
   * For example, a version value range of `[4.0.0, 5.0.0)` allows all bundle versions from `4.0.0` up to but not including `5.0.0`. For more information,
   * see the [interval notation for specifying version ranges](https://learn.microsoft.com/en-us/nuget/reference/package-versioning#version-ranges).
   * 
   * The following table lists the currently available version ranges of the default `Microsoft.Azure.Functions.ExtensionBundle` bundles and links to the extensions they include.
   * 
   * ```md
   *  | Bundle version | Version in host.json |
      |----------------|----------------------|
      | 1.x            | [1.*, 2.0.0)         |
      | 2.x            | [2.*, 3.0.0)         |
      | 3.x            | [3.3.0, 4.0.0)       |
      | 4.x            | [4.0.0, 5.0.0)       |
    ```
   * @ref https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register#extension-bundles
   * @default '[4.0.0, 5.0.0)'
   */
  version?: string;
}

export interface HealthMonitor {
  enabled?: boolean;
  healthCheckInterval?: string;
  healthCheckWindow?: string;
  healthCheckThreshold?: number;
  counterThreshold?: number;
}

export interface Logging {
  fileLoggingMode?: string;
  logLevel?: LogLevel;
  applicationInsights?: ApplicationInsights;
}

export interface LogLevel {
  'Function.MyFunction'?: string;
  default?: string;
}

export interface ApplicationInsights {
  samplingSettings?: SamplingSettings;
  dependencyTrackingOptions?: DependencyTrackingOptions;
  enableLiveMetrics?: boolean;
  enableDependencyTracking?: boolean;
  enablePerformanceCountersCollection?: boolean;
  httpAutoCollectionOptions?: HttpAutoCollectionOptions;
  snapshotConfiguration?: SnapshotConfiguration;
}

export interface SamplingSettings {
  isEnabled?: boolean;
  maxTelemetryItemsPerSecond?: number;
  evaluationInterval?: string;
  initialSamplingPercentage?: number;
  samplingPercentageIncreaseTimeout?: string;
  samplingPercentageDecreaseTimeout?: string;
  minSamplingPercentage?: number;
  maxSamplingPercentage?: number;
  movingAverageRatio?: number;
  excludedTypes?: string;
  includedTypes?: string;
}

export interface DependencyTrackingOptions {
  enableSqlCommandTextInstrumentation?: boolean;
}

export interface HttpAutoCollectionOptions {
  enableHttpTriggerExtendedInfoCollection?: boolean;
  enableW3CDistributedTracing?: boolean;
  enableResponseHeaderInjection?: boolean;
}

export interface SnapshotConfiguration {
  agentEndpoint?: any;
  captureSnapshotMemoryWeight?: number;
  failedRequestLimit?: number;
  handleUntrackedExceptions?: boolean;
  isEnabled?: boolean;
  isEnabledInDeveloperMode?: boolean;
  isEnabledWhenProfiling?: boolean;
  isExceptionSnappointsEnabled?: boolean;
  isLowPrioritySnapshotUploader?: boolean;
  maximumCollectionPlanSize?: number;
  maximumSnapshotsRequired?: number;
  problemCounterResetInterval?: string;
  provideAnonymousTelemetry?: boolean;
  reconnectInterval?: string;
  shadowCopyFolder?: any;
  shareUploaderProcess?: boolean;
  snapshotInLowPriorityThread?: boolean;
  snapshotsPerDayLimit?: number;
  snapshotsPerTenMinutesLimit?: number;
  tempFolder?: any;
  thresholdForSnapshotting?: number;
  uploaderProxy?: any;
}

export interface ManagedDependency {
  enabled?: boolean;
}

export interface Singleton {
  lockPeriod?: string;
  listenerLockPeriod?: string;
  listenerLockRecoveryPollingInterval?: string;
  lockAcquisitionTimeout?: string;
  lockAcquisitionPollingInterval?: string;
}
