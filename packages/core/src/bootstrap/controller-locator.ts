import ts from 'typescript';
import _ from 'lodash';

type ImportName = string;
type ModuleSpecifierName = string;
type ImportClauses = Record<ImportName, ModuleSpecifierName>;

export class ControllerLocator {
  private importClauses: ImportClauses = {};
  constructor(code: string) {
    this.importClauses = this.extractImportClauses(code);
  }

  private extractImportClauses(code: string) {
    const node = ts.createSourceFile('x.ts', code, ts.ScriptTarget.Latest);
    const importClauses: ImportClauses = {};
    for (const statement of node.statements) {
      const plainObjectStatement: any = _.cloneDeep(statement);
      if (plainObjectStatement.importClause === undefined) continue;
      const { importClause, moduleSpecifier } = plainObjectStatement;
      if (!Array.isArray(importClause.namedBindings.elements)) continue;
      for (const element of importClause.namedBindings.elements) {
        importClauses[element.name.escapedText] = moduleSpecifier.text;
      }
    }
    return importClauses;
  }

  public getControllerImportPath(controllerName: string) {
    if (!this.importClauses.hasOwnProperty(controllerName)) {
      throw new Error(`No controller '${controllerName}' already imported in bootstrap file `);
    }
    return this.importClauses[controllerName];
  }
}
