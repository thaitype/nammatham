import test from 'ava';
import { GitignoreManager } from './gitignore-manager';

test('GitignoreManager.insertScope at the begining', t => {
  const gitignoreManager = new GitignoreManager();
  gitignoreManager.gitignoreLines = [
    'line1',
    'line2',  
  ];
  gitignoreManager.insertScope(0, ['lineA', 'lineB'])
  t.deepEqual(gitignoreManager.gitignoreLines, [
    'lineA',
    'lineB',
    'line1',
    'line2',
  ]);
});
test('GitignoreManager.insertScope at the center', t => {
  const gitignoreManager = new GitignoreManager();
  gitignoreManager.gitignoreLines = [
    'line1',
    'line2',  
  ];
  gitignoreManager.insertScope(1, ['lineA', 'lineB'])
  t.deepEqual(gitignoreManager.gitignoreLines, [
    'line1',
    'lineA',
    'lineB',
    'line2',
  ]);
});
test('GitignoreManager.insertScope at the end', t => {
  const gitignoreManager = new GitignoreManager();
  gitignoreManager.gitignoreLines = [
    'line1',
    'line2',  
  ];
  gitignoreManager.insertScope(2, ['lineA', 'lineB'])
  t.deepEqual(gitignoreManager.gitignoreLines, [
    'line1',
    'line2',
    'lineA',
    'lineB',
  ]);
});

test('GitignoreManager Full Cycle when no existing scope', t => {
  const gitignoreManager = new GitignoreManager();
  gitignoreManager.gitignoreLines = [
    'line1',
    'line2',  
  ];
  gitignoreManager.appendFunctionName('functionA');
  gitignoreManager.constructWriteScope();
  t.deepEqual(gitignoreManager.gitignoreLines, [
    gitignoreManager.startScope(),
    'functionA',
    gitignoreManager.endScope(),
    'line1',
    'line2',
  ]);
});

test('GitignoreManager Full Cycle when wrong format scope 1', t => {
  const gitignoreManager = new GitignoreManager();
  gitignoreManager.gitignoreLines = [
    'line1',
    gitignoreManager.endScope(),
    gitignoreManager.startScope(),
    'line2',  
  ];
  gitignoreManager.appendFunctionName('functionA');
  gitignoreManager.constructWriteScope();
  t.deepEqual(gitignoreManager.gitignoreLines, [
    gitignoreManager.startScope(),
    'functionA',
    gitignoreManager.endScope(),
    'line1',
    'line2', 
  ]);
});

test('GitignoreManager Full Cycle when have existing scope', t => {
  const gitignoreManager = new GitignoreManager();
  gitignoreManager.gitignoreLines = [
    'line1',
    gitignoreManager.startScope(),
    'functionA',
    gitignoreManager.endScope(),
    'line2',  
  ];
  gitignoreManager.appendFunctionName('functionB');
  gitignoreManager.constructWriteScope();
  t.deepEqual(gitignoreManager.gitignoreLines, [
    'line1',
    gitignoreManager.startScope(),
    'functionB',
    gitignoreManager.endScope(),
    'line2',
  ]);
});
