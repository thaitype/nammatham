import type { Subprocess } from 'bun';
import { test, expect, describe, beforeAll, afterAll } from 'bun:test';
import path from 'path';

const TIME_LIMIT = parseInt(process.env.TIME_LIMIT ?? '60000'); // Default 60 seconds
const DEBUG = (process.env.LOCAL_TEST_DEBUG ?? '').toLowerCase() === 'true';
const LOCAL_URL = process.env.LOCAL_TEST_URL ?? 'http://127.0.0.1:7071';
const HEALTH_PATH = process.env.LOCAL_TEST_HEALTH_PATH ?? '/api/SimpleHttpTrigger';
const CURRENT_WORKING_DIR = process.env.CURRENT_WORKING_DIR ?? path.resolve('../../');

function waitForServer(url: string) {
  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
        });
        if (response.status === 200) {
          clearInterval(interval);
          resolve();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : error;
        console.error(`Server not ready: ${url} (Message: ${message})`);
      }
    }, 1000);
  });
}

/**
 * Check every seconds when reach the timeout, call the callback
 * @param ms
 */
function timer(timeout: number, callback?: () => void) {
  const interval = setInterval(() => {
    timeout -= 1000;
    if (timeout <= 0) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 1000);
}

describe('e2e-local', () => {
  let serverProcess: Subprocess | undefined;
  let serverLogs = '';

  beforeAll(async () => {
    console.log(`Starting server process on ${CURRENT_WORKING_DIR}`);
    // Place Azure Functions into the current directory
    const command = DEBUG ? ['sleep', '60'] : ['func', 'start', '--verbose'];
    const serverProcess = Bun.spawn(command, {
      cwd: CURRENT_WORKING_DIR,
      stdout: 'inherit',
      onExit(proc, exitCode, signalCode, error) {
        if (exitCode !== 0) {
          console.error(`Server process exited with code ${exitCode}`);
          process.exit(1);
        }
        if (error) {
          console.error(error);
        }
      },
    });
    timer(TIME_LIMIT, () => {
      console.log(`Server did not start within ${Math.round(TIME_LIMIT / 1000)} seconds`);
      if (!serverProcess) console.warn('Server process is not defined');
      serverProcess?.kill('SIGKILL');
      process.exit(1);
    });
    // Wait for the server to be ready
    await waitForServer(new URL(HEALTH_PATH, LOCAL_URL).toString());
  });

  afterAll(async () => {
    if (serverProcess) {
      console.log('Killing server process');
      serverProcess.kill('SIGKILL');
    }
  });

  test('should return 200 OK', async () => {
    try {
      const response = await fetch(new URL('/api/SimpleHttpTrigger', LOCAL_URL).toString());
      expect(response.status).toBe(200);
    } catch (error) {
      console.error(serverLogs); // Print server logs on failure
      throw new Error('Server did not respond with 200 OK');
    }
  });
});
