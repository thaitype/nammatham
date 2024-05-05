import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono().basePath('/api');

app.get('/SimpleHttpTrigger', c => {
  const userAgent = c.req.header('user-agent');
  console.log(`user agent is: ${userAgent}`);

  const invocationId = c.req.header('x-azure-functions-invocationid');
  console.log(`invocationid is: ${invocationId}`);

  return c.text('Hello World from node.js worker');
});

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
console.log(`Start server on on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
