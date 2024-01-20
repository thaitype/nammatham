import { expressPlugin } from '@nammatham/express';
import { createServer } from 'node:http';
import { parse } from 'node:url';
import blob from './functions/blob';
import hello from './functions/hello';
import { app } from './nammatham';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// For built-in Node.js HTTP server
// app.register(node({ dev, hostname, port }));

app.config({ dev, hostname, port });

const handle = app.getRequestHandler();

// Implement your own server
// app.useServer(node());

app.addFunctions(blob, hello);

app.start().then(() => {
  createServer(async (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url ?? '', true);

    await handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
