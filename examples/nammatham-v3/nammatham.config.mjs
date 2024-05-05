// @ts-check

/** @type {import('nammatham').NammathamConfigs} */
const nammathamConfig = {
  hostConfig: {
    version: '2.0',
    extensionBundle: {
      id: 'Microsoft.Azure.Functions.ExtensionBundle',
      version: '[3.15.0, 4.0.0)',
    },
    extensions: {
      http: {
        routePrefix: 'api',
      },
    },
    customHandler: {
      description: {
        defaultExecutablePath: '../node_modules/.bin/tsx',
        arguments: ['watch', '../src/main.ts'],
      },
      enableForwardingHttpRequest: true,
    },
    logging: {
      applicationInsights: {
        samplingSettings: {
          isEnabled: true,
          excludedTypes: 'Request',
        },
      },
      logLevel: {
        default: 'Trace',
      },
    },
  },
};

export default nammathamConfig;
