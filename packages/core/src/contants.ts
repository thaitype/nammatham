export const METADATA_KEY = {
  azureFunction: 'nammatham:azureFunction',
  controller: 'nammatham:controller',
  controllerParameter: 'nammatham:controllerParameter',
};

export const TYPE = {
  Controller: Symbol.for('Controller'),
  Method: Symbol.for('Method'),
  Context: Symbol.for('Context'),
};

export enum PARAMETER_TYPE {
  HttpTrigger = 'HttpTrigger',
  Response = 'Response',
  Context = 'Context',
  // Logger = 'Logger',
}