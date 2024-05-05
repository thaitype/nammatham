# Build for Azure Functions

Azure Functions Custom Handler has limitation that need to be use only the single executable file. or using node command

`host.json` when I try to use the `esbuild` for bundling the code, the output file is `main.js` 

```json
{
  "customHandler": {
    "description": {
      "defaultExecutablePath": "node",
       "arguments": [
        "main.js"
      ]
    },
    "enableForwardingHttpRequest": true
  }
}
```

However, the aim of Nammatham v3 to use Hono framework rather express.js, to use Hono with Node.js, they requires `@hono/node-server` pacakge.
That package requires at least node.js version 18.x and above. otherwise it will throw an error like this

```shell
var Request2 = class extends GlobalRequest {
                                ^
                                n/a
TypeError: Class extends value undefined is not a constructor or null
```

## Final Solution 

Make it single file executable by using `pkg` package or bun using [bun compile to Single-file executable](https://bun.sh/docs/bundler/executables)

For example, after build with the esbuild, then use the `bun` or `pkg` to compile the output file to single file executable,

Example:
```shell
npx pkg -t node18-macos-arm64 main.js 
npx pkg -t node18-linux-x64 main.js 
```

```shell

## Notes
- When publish into Azure Functions, the package.json will not be included in the final package.
So, it needs to specify the output file manually wheather it is ESM or CommonJS. for example `main.mjs` or `main.cjs`
- Azure Functions node runtime on Custom Handler is using Node.js 16.x (When I write this documentation)

The hono-node-server support the target node.js version 18.x and above