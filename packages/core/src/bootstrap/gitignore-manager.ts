import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';

export class GitignoreManager {
  readonly gitignoreFile = '.gitignore';
  readonly scopeIdentifier = 'Nammatham/AzureFunctions/GeneratedFiles';
  gitignorePath!: string;
  public gitignoreLines: string[] = [];
  protected functionNames: string[] = [];

  constructor(cwd?: string) {
    cwd = cwd ?? process.cwd();
    this.gitignorePath = path.join(cwd, this.gitignoreFile);
  }

  public async readLines() {
    if (fs.existsSync(this.gitignorePath)) {
      // Assume the gitignore file is a small file, more secure: https://geshan.com.np/blog/2021/10/nodejs-read-file-line-by-line/
      this.gitignoreLines = (await fsPromise.readFile(this.gitignorePath, 'utf8')).split(/\r?\n/);
    }
  }

  public async writeLines() {
    this.constructWriteScope();
    // TODO: Make support cross-platform OS
    await fsPromise.writeFile(this.gitignorePath, this.gitignoreLines.join('\n'), 'utf8');
  }

  protected isValidateScope(startPosition: number, endPosition: number) {
    if (startPosition < 0) return false;
    if (endPosition < 0) return false;
    if (startPosition > endPosition) return false;
    return true;
  }

  public constructWriteScope() {
    this.cleanMismatchFormatScope();
    const startScopePosition = this.gitignoreLines.indexOf(this.startScope());
    const endScopePosition = this.gitignoreLines.indexOf(this.endScope());
    const scopeLength = endScopePosition - startScopePosition;
    const functionNamesScope = [this.startScope(), ...this.functionNames, this.endScope()];
    if (this.isValidateScope(startScopePosition, endScopePosition)) {
      this.gitignoreLines.splice(startScopePosition, scopeLength + 1);
      this.insertScope(startScopePosition, functionNamesScope);
    } else {
      this.insertScope(0, functionNamesScope);
    }
  }

  private cleanMismatchFormatScope() {
    const startScopePosition = this.gitignoreLines.indexOf(this.startScope());
    const endScopePosition = this.gitignoreLines.indexOf(this.endScope());
    if (this.isValidateScope(startScopePosition, endScopePosition)) {
      // Remove next line duplicate start scope
      this.removeLineDuplicateScope(startScopePosition + 1, this.startScope());
      this.removeLineDuplicateScope(endScopePosition + 1, this.endScope());
    } else {
      this.removeLineDuplicateScope(0, this.startScope());
      this.removeLineDuplicateScope(0, this.endScope());
    }
  }

  private removeLineDuplicateScope(index: number, scopeName: string){
    const foundScopeLines = this.listScope(index + 1, scopeName);
    this.removeScopeLines(foundScopeLines);
  }

  /** @interal */
  public listScope(index: number, scopeName: string): number[] {
    const foundScopeLines = [];
    for (let i = index; i < this.gitignoreLines.length; i++) {
      if (scopeName === this.gitignoreLines[i]) {
        foundScopeLines.push(i);
      }
    }
    return foundScopeLines;
  }

  /** @internal */
  public removeScopeLines(lines: number[]) {
    /** Make sure the lines is sorted */
    lines.sort();
    for (let i = 0; i < lines.length; i++) {
      /** Everytime the array elment is deleted, the index will delete should step forward */
      this.gitignoreLines.splice(lines[i] - i, 1);
    }
  }

  /** @internal */
  public insertScope(index: number, lines: string[]) {
    return this.gitignoreLines.splice(index, 0, ...lines);
  }

  public appendFunctionName(functionName: string) {
    this.functionNames.push(functionName);
    // for(const [index, line] of this.gitignoreLines.entries()){
  }

  public startScope() {
    return `# ${this.scopeIdentifier}:start`;
  }

  public endScope() {
    return `# ${this.scopeIdentifier}:end`;
  }
}
