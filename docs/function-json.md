# Azure Functions Custom Handler

https://github.com/Azure/azure-functions-host/issues/5615
[HttpWorker]Add configuration flag in opt-out of http trigger request forward

https://github.com/anthonychu/azure-functions-deno-worker/blob/main/mod.ts

# Trace Log from Azure Function hosts

Normal State

```
 Invocation Request:Method: GET, RequestUri: 'http://127.0.0.1:63950/api/SimpleHttpTrigger', Version: 1.1, Content: <null>, Headers:
 {
   Accept: */*
   Connection: keep-alive
   Host: localhost:7071
   User-Agent: PostmanRuntime/7.37.3
   User-Agent: Azure-Functions-Host/4.33.2.22572
   Accept-Encoding: gzip, deflate, br
   Cache-Control: no-cache
   Postman-Token: e6c94d37-a597-4b97-a88d-28c7e3d74748
   X-Azure-Functions-HostVersion: 4.33.2.22572
   X-Azure-Functions-InvocationId: b986fcf6-b00a-4a70-a8df-88ce7d39a321
 }
```

with other bindings

```
Invocation Request:Method: POST, RequestUri: 'http: //127.0.0.1:64093/SimpleHttpTrigger', Version: 1.1, Content: System.Net.Http.ObjectContent`1[Microsoft.Azure.WebJobs.Script.Workers.Http.HttpScriptInvocationContext], Headers:

{
  X-Azure-Functions-HostVersion: 4.33.2.22572
  X-Azure-Functions-InvocationId: fa4fcd1a-a965-431e-8f10-a15c07b4fe2a
  User-Agent: Azure-Functions-Host/4.33.2.22572
  Content-Type: application/json; charset=utf-8
}

{"Data":{"req":{"Url":"http://localhost:7071/api/SimpleHttpTrigger","Method":"GET","Query":{},"Headers":{"Accept":["*/*"],"Connection":["keep-alive"],"Host":["localhost:7071"],"User-Agent":["PostmanRuntime/7.37.3"],"Accept-Encoding":["gzip, deflate, br"],"Cache-Control":["no-cache"],"Postman-Token":["f7cc026e-5cb0-4b7a-8f70-ed394a0e97ef"]},"Params":{},"Identities":[{"AuthenticationType":null,"IsAuthenticated":false,"Actor":null,"BootstrapContext":null,"Claims":[],"Label":null,"Name":null,"NameClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name","RoleClaimType":"http://schemas.microsoft.com/ws/2008/06/identity/claims/role"}]}},"Metadata":{"Query":{},"Headers":{"Accept":"*/*","Connection":"keep-alive","Host":"localhost:7071","User-Agent":"PostmanRuntime/7.37.3","Accept-Encoding":"gzip, deflate, br","Cache-Control":"no-cache","Postman-Token":"f7cc026e-5cb0-4b7a-8f70-ed394a0e97ef"},"sys":{"MethodName":"SimpleHttpTrigger","UtcNow":"2024-05-14T15:14:15.128919Z","RandGuid":"7a85f722-f6ba-4add-9a45-7ed862be02ae"}}}

Sending invocation for function: 'SimpleHttpTrigger' invocationId: 'fa4fcd1a-a965-431e-8f10-a15c07b4fe2a'
```

## Logging

- Cannot specify log level in response return https://github.com/Azure/azure-functions-host/issues/6608
- Using `enableForwardingHttpRequest` to be `false`, the log will be shown in the app insights.
- JSON Logging may need more work in KQL to query https://github.com/Azure/azure-functions-host/issues/6608#issuecomment-779621939
- Logging cannot see the timestamp in the log