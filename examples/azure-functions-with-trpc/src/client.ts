// Example code from https://github.com/trpc/trpc/blob/main/examples/express-minimal/src/client.ts

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

async function main() {
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc',
      }),
    ],
  });

  try {

    /**
     * Or you can access by URL: http://localhost:3000/api/trpc/greet
     */
    const withoutInputQuery = await client.greet.query();
    console.log(withoutInputQuery);

    // Note: Not support yet, PR is welcome!
    // const withInputQuery = await client.greet.query({ name: 'Alex' });
    // console.log(withInputQuery);
  } catch (error) {
    console.error('Error:', error);
  }
}

void main();