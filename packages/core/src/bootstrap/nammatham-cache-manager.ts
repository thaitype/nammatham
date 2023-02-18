import { IFunctionAppOption } from './function-app';
import path from 'node:path';
import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import _ from 'lodash';
import { GitignoreManager } from './gitignore-manager';

const config = {
  cacheDir: '.nammatham',
  functionCacheFile: 'functionCache.json'
}

interface FunctionMetadata {
  functionNames?: string[],
  created?: string;
}

// TODO: validate with Zod later
interface CacheSchema { 
  functionOutput: {
    previous: FunctionMetadata;
    current: FunctionMetadata;
  }
}

export class NammathamCacheManager {
  private cachePath!: string;
  constructor(private functionAppOption: IFunctionAppOption, private functionNames: string[]) {
    this.cachePath = path.join(this.functionAppOption.cwd || '', config.cacheDir, config.functionCacheFile);
  }

  public async readFile(){
    if (fs.existsSync(this.cachePath)) {
      const data = await fsPromise.readFile(this.cachePath, 'utf8');
      try {
        return JSON.parse(data) as CacheSchema;
      } catch(e){
        console.error(`Cannot parsing cache json at ${this.cachePath}`);
      }
    }
    return undefined;
  }

  public async processCache(cacheData: CacheSchema | undefined) {
    let previousFunctions: FunctionMetadata = {};
    if(cacheData){
      previousFunctions = cacheData.functionOutput.current;
    }
    const currentFunctions: FunctionMetadata = {
      created: new Date().toISOString(),
      functionNames: this.functionNames
    }
    return {
      functionOutput: {
        current: currentFunctions,
        previous: previousFunctions,
      }
    } as CacheSchema;
  }
  public async execute(){
    const cacheData = await this.readFile();
    const newCacheData = await this.processCache(cacheData);
    if(this.functionAppOption.clean){
      for(const functionName of newCacheData?.functionOutput.previous.functionNames || []){
        const functionPath = path.join(this.functionAppOption.output || '', functionName);
        fs.rmSync(functionPath, { recursive: true, force: true });
      }
    }
    await fsPromise.mkdir(path.join(this.functionAppOption.cwd || '', config.cacheDir), { recursive: true });
    await fsPromise.writeFile(this.cachePath, JSON.stringify(newCacheData, null, 2), 'utf8');
    await this.addGitignore();
  }

  public async addGitignore(){
    const gitignoreManager = new GitignoreManager('Nammatham/AzureFunctions/Cache', this.functionAppOption.cwd);
    await gitignoreManager.readLines();
    gitignoreManager.appendContentLines(config.cacheDir);
    await gitignoreManager.writeLines();
  }

}
