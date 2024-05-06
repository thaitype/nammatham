import { test, expect } from 'bun:test';

const url = process.env.AZURE_FUNCTIONS_URL;
const apiKey = process.env.AZURE_FUNCTIONS_API_KEY;
if (!url) throw new Error('AZURE_FUNCTIONS_URL not set');
if (!apiKey) throw new Error('AZURE_FUNCTIONS_API_KEY not set');

test('e2e', async () => {
  const response = await fetch(new URL(`/api/SimpleHttpTrigger?code=${apiKey}`, url).toString());
  expect(response.status).toBe(200);
});
