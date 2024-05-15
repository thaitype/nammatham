import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { honoAdapter } from 'nammatham'; // Actually => "nammatham/hono";
import nammatham from "./nammatham";

// DO NOT SET `basePath` for Hono App, Azure Functions will handle it
const app = new Hono();
app.use(logger());

app.route("/", honoAdapter(nammatham));

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
console.log(`Start server on on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  // Sending function metadata to nammatham cli to generate function.json
  nammatham
};