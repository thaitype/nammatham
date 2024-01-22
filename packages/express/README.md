<p align="center">
  <a href="http://thadaw.com/" target="blank"><img src="https://i.ibb.co/QmTh7x4/Nammatham-Logo-v2.png" width="120" alt="Nammatham Logo" /></a>
</p>

<p align="center">
Type-safe Serverless Library for Azure Functions and friends 
</p>

<p align="center"><a href="https://www.npmjs.com/package/nammatham"><img alt="NPM Version (with dist tag)" src="https://img.shields.io/npm/v/nammatham/alpha">
 <a href="https://www.npmjs.com/package/nammatham"><img src="https://img.shields.io/npm/dt/nammatham" alt="npm download"></a></p>


> 🚧 Alpha Stage: Internal Use Only 🚧
> 
> Please note that Nammatham v2 is currently in its Alpha stage and is intended for internal use only. As we actively develop and refine the platform, be aware that the API may undergo frequent changes. [Tracking v2 Roadmap](https://github.com/thaitype/nammatham/issues?q=is%3Aissue+is%3Aopen+label%3Av2-blocker)
> 
> Note: [Nammatham v1](https://www.npmjs.com/package/nammatham) is currently in maintenance mode. no new features are actively being developed


| Version | Status      | Azure Functions <br>Node.js Lib | Branch       | Build Status                                                                                                                                                                                                                                                                                                                |
| ------- | ----------- | ----------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.x    | Maintenance | v3.x                    | [v1.x][v1.x] | [![Build & Test](https://github.com/thaitype/nammatham/actions/workflows/test.yml/badge.svg?branch=v1.x)](https://github.com/thaitype/nammatham/actions/workflows/test.yml) [![codecov](https://codecov.io/gh/thaitype/nammatham/branch/v1.x/graph/badge.svg?token=Y7ZMDKFPAN)](https://codecov.io/gh/thaitype/nammatham) |
| v2.x    | Alpha       | v4.x                    | [main][main] | [![Build & Test](https://github.com/thaitype/nammatham/actions/workflows/test.yml/badge.svg?branch=main.unittest)](https://github.com/thaitype/nammatham/actions/workflows/test.yml) [![codecov](https://codecov.io/gh/thaitype/nammatham/branch/main/graph/badge.svg?token=Y7ZMDKFPAN)](https://codecov.io/gh/thaitype/nammatham)                                                                                                                                        |

[v1.x]: https://github.com/thaitype/nammatham/tree/v1.x
[main]: https://github.com/thaitype/nammatham/tree/main

## Description
Nammatham (นามธรรม in Thai, pronounced `/naam ma tham/`, means **abstract** in Thai) is Azure Function Nodejs.

## Getting Started for Azure Functions

### Install

```bash
# Including all packages
npm install nammatham@alpha
```

You can also install independently
```bash
npm install @nammatham/core @nammatham/azure-functions @nammatham/express
```

### Example

You can see [examples](examples) or follow the minimal app getting started below:

```typescript
import { initNammatham, AzureFunctionsAdapter, expressPlugin } from "nammatham";

const n = initNammatham.create(new AzureFunctionsAdapter());
const func = n.func;
const app = n.app;

const helloFunction = func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(async ({trigger, context}) => {
    context.log('HTTP trigger function processed a request.');
    context.debug(`Http function processed request for url "${trigger.url}"`);
    const name = trigger.query.get('name') || (await trigger.text()) || 'world';
    return { body: `Hello, ${name}!` };
  });

app.addFunctions(helloFunction);
app.register(expressPlugin());
app.start();
```

Then edit `package.json` like this;

```json
{
  "main": "dist/src/main.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx watch src/main.ts",
    "start": "tsc && func start"
  }
}
```

Run Dev Server on locally, (For dev server use `tsx watch` for reloading run dev server using `express` )

```
npm run dev
```

Run Azure Functions on locally (Using Official Azure Functions Node.js)

```
npm start
```


## Nammatham Packages

- [core][@nammatham/core], Nammatham Core package for initializing Nammatham App

### Available Adatpers

- [azure-functions][@nammatham/azure-functions], Azure Functions Adapter for Nammatham, internally, Azure Functions in local dev mode is dependend on Express.js.

### Available Plugins

- [express][@nammatham/express], Express Plugin for run server. Nammatham itself doesn't contain any server, enabling this plugin to provide better DX than the original server e.g. Azure Functions Runtime
- [trpc-azure-functions][@nammatham/trpc-azure-functions], provide [tRPC](https://trpc.io/) Plugin for Azure Functions, inclduing [express][@nammatham/express] server for local testing.

[@nammatham/core]: packages/core
[@nammatham/azure-functions]: packages/azure-functions
[@nammatham/express]: packages/express
[@nammatham/trpc-azure-functions]: packages/trpc-azure-functions


## Talks 
Empowering TypeScript on Azure Functions with Nammatham, Azure Open Source Day @ Microsoft Thailand, 25 Mar 2023
[![](docs/imgs/azure-open-source-day-2023.png)](https://www.youtube.com/watch?v=n6B4-5Lt2h0) (Thai speech, subtitle will added later)
- Slides: https://docs.google.com/presentation/d/1WUIXaUxXaiixZ2bgGCfx-f4Gdrmjl4RfbwKaEfAC6t4/edit?usp=sharing


<!-- ## What's different with Azure Functions v4 (Official Library) -->

## Local Dev Setup

```bash
# Install dependencies
pnpm install
# Before dev (Update workspace to local dependencies)
pnpm pre-local && pnpm install
# While dev
pnpm dev
# After dev before submitting PRs (Update workspace to actual dependencies), `pnpm install` for making sure lockfile is correct.
pnpm post-local && pnpm install
# Release package
pnpm release
```

## Inspiration 
- [Azure Functions .NET](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process)
- [inversify-express-utils](https://github.com/inversify/inversify-express-utils) - We use inversify as a Dependency Injection Tool.
- [Nestjs](https://nestjs.com/)
- [typestack/routing-controllers](https://github.com/typestack/routing-controllers)
- [azure-middleware](https://github.com/emanuelcasco/azure-middleware) - Azure Functions Middleware Libray

## Author
- Thada Wangthammang, Software Engineer, Thailand