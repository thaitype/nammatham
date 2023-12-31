# @nammatham/express

<p align="center">
  <a href="http://thadaw.com/" target="blank"><img src="https://i.ibb.co/QmTh7x4/Nammatham-Logo-v2.png" width="120" alt="Nammatham Logo" /></a>
</p>

<p align="center">
Type-safe Azure Function Library 
</p>

<p align="center"><a href="https://www.npmjs.com/package/nammatham"><img src="https://img.shields.io/npm/v/nammatham" alt="npm version"></a> <a href="https://www.npmjs.com/package/nammatham"><img src="https://img.shields.io/npm/dt/nammatham" alt="npm download"></a></p>


> Due to Azure Functions Node.js v4 Release GA General availability, **Nammatham** v1 is now maintainance mode.

| Version | Status         | Azure Functions Node.js | Branch       | Build Status                                                                                                                                                                                                                                                                                                          |
| ------- | -------------- | ----------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.x    | Maintenance    | v3.x                    | [v1.x][v1.x] | [![Build & Test](https://github.com/thaitype/nammatham/actions/workflows/test.yml/badge.svg)](https://github.com/thaitype/nammatham/actions/workflows/test.yml) [![codecov](https://codecov.io/gh/mildronize/nammatham/branch/main/graph/badge.svg?token=Y7ZMDKFPAN)](https://codecov.io/gh/mildronize/nammatham) |
| v2.x    | In Development | v4.x                    | [next][next] | [Tracking v2 Roadmap](https://github.com/thaitype/nammatham/issues?q=is%3Aissue+is%3Aopen+label%3Afunc-v4)                                                                                                                                                                                                            |

[v1.x]: https://github.com/thaitype/nammatham/tree/v1.x
[next]: https://github.com/thaitype/nammatham/tree/next


## Description
Nammatham (นามธรรม in Thai, pronounced `/naam ma tham/`, means **abstract** in Thai) is Azure Function Nodejs Lightweight framework with Dependency Injection. Provide type safety wrapping `function.json`

## Talks 
Empowering TypeScript on Azure Functions with Nammatham, Azure Open Source Day @ Microsoft Thailand, 25 Mar 2023
[![](docs/imgs/azure-open-source-day-2023.png)](https://www.youtube.com/watch?v=n6B4-5Lt2h0) (Thai speech, subtitle will added later)
- Slides: https://docs.google.com/presentation/d/1WUIXaUxXaiixZ2bgGCfx-f4Gdrmjl4RfbwKaEfAC6t4/edit?usp=sharing

## Minimal Get Started

For dev server, using express.js

```typescript
import { AzureFunctionsAdapter } from "@nammatham/azure-functions";
import { initNammatham } from "@nammatham/core";
import { expressPlugin } from "@nammatham/express";

const n = initNammatham.create(new AzureFunctionsAdapter());
const func = n.func;
const app = n.app;

const helloFunction = func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(async (request, ctx) => {
    ctx.context.log('HTTP trigger function processed a request.');
    ctx.context.debug(`Http function processed request for url "${request.url}"`);
    const name = request.query.get('name') || (await request.text()) || 'world';
    return { body: `Hello, ${name}!` };
  });

app.addFunctions(helloFunction);
if (process.env.NAMMATHAM_ENV === 'development') {
  app.register(expressPlugin());
}
app.start();
```

Then edit `package.json` like this;

```json
{
  "main": "dist/src/main.js",
  "scripts": {
    "dev": "cross-env NAMMATHAM_ENV=development tsx watch src/main.ts"
  }
}
```

Run 

```
npm run dev
```

The result commandline will show (Dev Server): 

```

Start Nammatham, Type-safe Serverless Framework

[12:44:14.784] INFO (44575): Using adapter: AzureFunctionsAdapter
[12:44:14.786] INFO (44575): Function "hello" added
[12:44:14.786] INFO (44575): Using middleware: expressPlugin
[12:44:14.793] INFO (44575): All functions registered
[12:44:14.794] INFO (44575): Dev Server started at http://localhost:3000

Functions:

        hello: [GET] http://localhost:3000/api/hello-world
```

<!-- ## What's different with Azure Functions v4 (Official Library) -->

## Inspiration 
- [Azure Functions .NET](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process)
- [inversify-express-utils](https://github.com/inversify/inversify-express-utils) - We use inversify as a Dependency Injection Tool.
- [Nestjs](https://nestjs.com/)
- [typestack/routing-controllers](https://github.com/typestack/routing-controllers)
- [azure-middleware](https://github.com/emanuelcasco/azure-middleware) - Azure Functions Middleware Libray

## Author
- Thada Wangthammang, Software Engineer, Thailand