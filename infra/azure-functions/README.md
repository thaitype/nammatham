## Setup Infra

```
az ad sp create-for-rbac --display-name "nammatham-github-actions-e2e-tests" --role "Contributor" --scopes "/subscriptions/29523625-6fa5-4d9a-86bc-da000544be7d/resourceGroups/rg-nammatham-nmt-e2e-node18-linux-x64-xxxxxxxxxxxxxx" --json-auth
```

## How to add new Azure Functions to the project

### 1. Add more config in `src/config.ts`

For example:

```ts
export const infraConfigs = createInfraConfig(
  {
    // ....
    // ^ the above is the existing infra config
    'bun-linux-x64': process.env.RESOURCE_IDENTIFIER_BUN_LINUX_X64,
  },
  [
    {
      platform: 'linux',
      arch: 'x64',
      runtime: 'bun',
      mode: 'create',
      isDeployable: true,
    },
  ]
);
```

### 2. Add more `RESOURCE_IDENTIFIER_BUN_LINUX_X64` in the `.env` file
using this: https://codebeautify.org/generate-random-hexadecimal-numbers

```env
RESOURCE_IDENTIFIER_BUN_LINUX_X64=6a2026b8a8736f
```

### 3. Run Plan

```sh
pnpm plan
```

the result will be

```
Running in plan mode: true
┌───┬──────────┬───────┬─────────┬─────────┬──────────────┬────────────────────┬────────┐
│   │ platform │ arch  │ runtime │ version │ isDeployable │ resourceIdentifier │ mode   │
├───┼──────────┼───────┼─────────┼─────────┼──────────────┼────────────────────┼────────┤
│ 0 │ linux    │ x64   │ node    │ 18      │ true         │ c95a3623a9a936     │        │
│ 1 │ win      │ x64   │ node    │ 18      │ true         │ 61abf3b30d9327     │        │
│ 2 │ macos    │ arm64 │ node    │ 18      │ false        │ undefined          │        │
│ 3 │ linux    │ x64   │ bun     │         │ true         │ 21a4f3b0855015     │ create │
└───┴──────────┴───────┴─────────┴─────────┴──────────────┴────────────────────┴────────┘
Skipping infra config with target node18-linux-x64
Skipping infra config with target node18-win-x64
Skipping infra config with target node18-macos-arm64
```

### 3. Run Apply

```sh
pnpm apply
```

### 4. Setup Github Actions & Secrets

add more env in `.github/workflows/e2e.yml`

```yml
env:
  # ...
  # ^ the above is the existing env
  RESOURCE_IDENTIFIER_BUN_LINUX_X64: ${{ secrets.RESOURCE_IDENTIFIER_BUN_LINUX_X64 }}
```

then use the resource identifier in the github secret `RESOURCE_IDENTIFIER_BUN_LINUX_X64`, from step 2 (`6a2026b8a8736f`).

### 5. Change infra mode config in `src/config.ts`, by remove the `mode: 'create'`

For example:

```ts
export const infraConfigs = createInfraConfig(
  {
    // ....
    // ^ the above is the existing infra config
    'bun-linux-x64': process.env.RESOURCE_IDENTIFIER_BUN_LINUX_X64,
  },
  [
    {
      platform: 'linux',
      arch: 'x64',
      runtime: 'bun',
      // mode: 'create',
      isDeployable: true,
    },
  ]
);
```