import Handlebars from 'handlebars';
import stripIndent from 'strip-indent';

export interface IAzFunctionHandlebarsTemplateData {
  controllerName: string;
  controllerRelativePath: string;
  // methodName: string;
  functionName: string;
  startupPath: string;
}

export const azFunctionHandlebarsTemplate = stripIndent(`
  import 'reflect-metadata';
  import { AzureFunction, Context } from '@azure/functions';
  import { {{controllerName}} } from '{{controllerRelativePath}}';
  import app from '{{startupPath}}';

  const {{functionName}}: AzureFunction = async function (
    context: Context,
    ...args: any[]
  ): Promise<void> {
    return app.run({
      classTarget: {{controllerName}},
      azureFunctionParams: [context, ...args]
    });
  };

  export default {{functionName}};
`);

export const azFunctionTemplate = Handlebars.compile<IAzFunctionHandlebarsTemplateData>(azFunctionHandlebarsTemplate);
