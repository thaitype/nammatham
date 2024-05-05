## Setup Infra

```
az ad sp create-for-rbac --display-name "nammatham-github-actions-e2e-tests" --role "Contributor" --scopes "/subscriptions/29523625-6fa5-4d9a-86bc-da000544be7d/resourceGroups/rg-nammatham-nmt-e2e-node18-linux-x64-f04f60dfb53e02" --json-auth
```