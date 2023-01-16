import { Container } from "inversify";
import { TYPE } from "../contants";
import { AzureFunctionMethodMetadata } from "../interfaces";

import fs from 'node:fs/promises';
import path from 'node:path';
import { attachControllers } from "./attach-controllers";


interface IBootstrapOption {
  /**
   * Allow self define container
   */
  container?: Container;
  /**
   * Current working directory, default is current directory
   */
  cwd?: string;
  /**
   * Output generated TypeScript files and function config
   */
  output?: string;
}

export async function bootstrap(option?: IBootstrapOption){
    const container = option?.container ?? new Container();
    const cwd = option?.cwd ?? process.cwd();
    const output = option?.output ?? 'out';
    const azureFunctionsMethodMetadata: AzureFunctionMethodMetadata[] = attachControllers(container);

    console.log('----');
    
    // 1. get list of functions name
    for(const metadata of azureFunctionsMethodMetadata){
      console.log(metadata.name);
      const functionPath = path.join(output, metadata.name);
      // TODO: Make concurrent later
      await fs.mkdir(functionPath, { recursive: true });
    }
    // 2. create out dir

    
    // TODO: generate files from container 
    // TODO: 
    /**
     *  └── out
          └── GetUsers
              ├── function.json
              └── index.ts
     */
}

