# Bun

## Issues

Summary:
- `lodash_default is not a function` error when using `lodash.camelcase` package
- Using default import of `lodash` package may cause this issue

Deployment at:
- https://github.com/thaitype/nammatham/actions/runs/9105382778
- Executable File from `bun-win-x64` target
  - Using bun to compile into single executable file

Platform:

- Azure Functions Windows
- Bun v1.1.8 (Windows x64)

Package:

- lodash.camelcase v4.3.0
- nammatham on [commit 3f3b7b7 (2024-05-15)](https://github.com/thaitype/nammatham/commit/96ad8958c843553b0156d968b72e1d285c85041f)
  - Build with tsup v8.0.1

```
Bun v1.1.8 (Windows x64)
n/a
at B:/~BUN/root/main.exe:3061:12
at http (B:/~BUN/root/main.exe:2983:5)
at http (B:/~BUN/root/main.exe:3031:13)
TypeError: lodash_default is not a function. (In 'lodash_default(options.name ?? options.route)', 'lodash_default' is undefined)
^
3031 | name: lodash_default(options.name ?? options.route),
3030 | this.functions.push({
3029 | }
3028 | throw new Error("Route or Name is required");
3027 | if (options.route === undefined && options.name === undefined) {
3026 | http(options) {
```