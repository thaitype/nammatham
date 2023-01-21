import Handlebars from "handlebars";
import stripIndent from "strip-indent";

export interface IAzFunctionHandlebarsTemplateData {
  controllerName: string;
  controllerRelativePath: string;
  methodName: string;
  functionName: string;
}

export const azFunctionHandlebarsTemplate = stripIndent(`
  import 'reflect-metadata';
  import { AzureFunction, Context } from '@azure/functions';
  import { funcBootstrap } from 'nammatham';
  import { {{controllerName}} } from '{{controllerRelativePath}}';

  const {{functionName}}: AzureFunction = async function (
    context: Context,
    ...args: any[]
  ): Promise<void> {
    funcBootstrap({
      classTarget: {{controllerName}},
      methodName: '{{methodName}}',
      azureFunctionParams: [context, ...args]
    });
  };

  export default {{functionName}};
`);


export const azFunctionTemplate = Handlebars.compile<IAzFunctionHandlebarsTemplateData>(azFunctionHandlebarsTemplate);