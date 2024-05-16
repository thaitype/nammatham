import { test, expect, describe, beforeAll, afterAll } from 'bun:test';
import { execa, type ResultPromise } from 'execa';

const url = 'http://localhost:7071';
const healthPath = '/api/SimpleHttpTrigger';

function waitForServer(url: string) {
  return new Promise<void>((resolve, reject) => {
    const checkServer = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
        } else {
          setTimeout(checkServer, 1000);
        }
      } catch (error) {
        setTimeout(checkServer, 1000);
      }
    };
    checkServer();
  });
}

describe('e2e-local', () => {
  let serverProcess:
    | ResultPromise<{
        stdout: 'inherit';
        killSignal: 'SIGKILL';
      }>
    | undefined;
  let serverLogs = '';

  beforeAll(async () => {
    // Place Azure Functions into the current directory
    serverProcess = execa({ stdout: 'inherit', killSignal: 'SIGKILL' })`func start --verbose`;
    // Wait for the server to be ready
    await waitForServer(new URL(healthPath, url).toString());
  });

  afterAll(async () => {
    if (serverProcess) {
      console.log('Killing server process');
      serverProcess.kill();
    }
  });

  test('should return 200 OK', async () => {
    try {
      const response = await fetch(new URL('/api/SimpleHttpTrigger', url).toString());
      expect(response.status).toBe(200);
    } catch (error) {
      console.error(serverLogs); // Print server logs on failure
      throw new Error('Server did not respond with 200 OK');
    }
  });
});
