# How Nammatham works?

Nammatham is a framework for building Azure Functions using TypeScript. It works by running two steps during the development process:

1. The `bootstrap` phase generates two files for each function: `index.js` and `function.json`.
2. The `functionBootstrap` phase is called by `index.js` from the previous step and it loads all dependencies and returns the actual method defined in the controller.

Both phases use the `attachControllers()` function to inject the dependencies defined in the decorator such as `controller` and `functionName` decorator. In production, only the `functionBootstrap` phase is run to execute each function endpoint. This allows for better performance and lower overhead.