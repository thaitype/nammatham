// @ts-check

/** @type {import('nammatham').NammathamConfigs} */
const nammathamConfig = {
  runtime: 'bun',
  hostConfig: {
    version: '2.0',
    logging: {
      applicationInsights: {
        samplingSettings: {
          isEnabled: true,
          excludedTypes: 'Request',
        },
      },
      // logLevel: {
      //   default: 'Trace',
      // },
    },
  },
};

export default nammathamConfig;
