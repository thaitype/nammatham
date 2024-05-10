import { test, expect } from 'bun:test';
// import supertest from 'supertest';

const url = process.env.AZURE_FUNCTIONS_URL;
const apiKey = process.env.AZURE_FUNCTIONS_API_KEY;
if (!url) throw new Error('AZURE_FUNCTIONS_URL not set');
if (!apiKey) throw new Error('AZURE_FUNCTIONS_API_KEY not set');

test('e2e', async () => {
  // const response = await supertest(url).get(`/api/SimpleHttpTrigger?code=${apiKey}`);
  const response = await fetch(new URL(`/api/SimpleHttpTrigger?code=${apiKey}`, url).toString(), {
    method: 'GET',
  });
  expect(response.status).toBe(200);
});
