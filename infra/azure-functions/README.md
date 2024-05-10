## Setup Infra

```
az ad sp create-for-rbac --display-name "nammatham-github-actions-e2e-tests" --role "Contributor" --scopes "/subscriptions/29523625-6fa5-4d9a-86bc-da000544be7d/resourceGroups/rg-nammatham-nmt-e2e-node18-linux-x64-f04f60dfb53e02" --json-auth
```

## How to add new Azure Functions to the project

```sh
pnpm plan
```

the result will be

```
Running in plan mode: true
┌───┬──────────┬───────┬─────────┬─────────┬──────────────┬────────────────────┐
│   │ platform │ arch  │ runtime │ version │ isDeployable │ resourceIdentifier │
├───┼──────────┼───────┼─────────┼─────────┼──────────────┼────────────────────┤
│ 0 │ linux    │ x64   │ node    │ 18      │ true         │ xxxxxxxxxxxxxx     │
│ 1 │ win      │ x64   │ node    │ 18      │ true         │ xxxxxxxxxxxxxx     │
│ 2 │ macos    │ arm64 │ node    │ 18      │ false        │ undefined          │
└───┴──────────┴───────┴─────────┴─────────┴──────────────┴────────────────────┘
Skipping infra config with target node18-linux-x64
Skipping infra config with target node18-win-x64
Skipping infra config with target node18-macos-arm64
```