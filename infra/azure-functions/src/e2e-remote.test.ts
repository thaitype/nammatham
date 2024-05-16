import { test, expect, describe, beforeAll } from 'bun:test';

describe('e2e-remote', () => {

  let url: string | undefined;
  let apiKey: string | undefined;

  beforeAll(() => {
    url = process.env.AZURE_FUNCTIONS_URL;
    apiKey = process.env.AZURE_FUNCTIONS_API_KEY;
    if (!url) throw new Error('AZURE_FUNCTIONS_URL not set');
    if (!apiKey) throw new Error('AZURE_FUNCTIONS_API_KEY not set');
    console.log(`Testing remote Azure Functions at ${url}`);
  });

  test('should return 200 OK', async () => {
    const response = await fetch(new URL(`/api/SimpleHttpTrigger?code=${apiKey}`, url).toString(), {
      method: 'GET',
    });

    expect(response.status).toBe(200);
  });
});
