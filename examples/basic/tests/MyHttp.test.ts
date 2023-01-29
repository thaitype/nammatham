import test from 'ava';
import fetch from 'node-fetch';
import { setTimeout } from 'timers/promises';
import execa, { ExecaChildProcess } from 'execa';

interface Context {
  child: ExecaChildProcess<unknown>;
}

const port = '3242';

test.beforeEach(async t => {
  // Start the command in a child process before each test
  await execa('pnpm', ['build']);
  (t.context as Context).child = execa('pnpm', ['start', '--port', port]);
});

test.afterEach.always(async t => {
  // Force exit the child process after each test
  console.log('hey kill');
  (t.context as Context).child.kill('SIGTERM', {
    // This use for force kill the process
    forceKillAfterTimeout: 4000,
  });
});

test('example test', async t => {
  // wait until the server start already,
  // TODO: Fix by wait until the port in available
  //   await setTimeout(5000);
  //   const response = await fetch(`http://localhost:${port}/api/MyHttp?name=koko`);
  //   const data = await response.json();
  //   const { stdout } = await (t.context as Context).child;
  t.is({} as any, {
    data: `[MyHttp] hello get user with koko`,
  });
  //   (t.context as Context).child.kill();
});
