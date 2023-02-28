https://www.youtube.com/watch?v=ZX4XoRJs3Ek

`host.json`

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[3.3.0, 4.0.0)"
  }
}
```

After config `host.json`, install all extension

```bash
func extensions install
```

Run [Azurtie](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=npm) locally

```
npx azurite
```