
# Blob Trigger 

## if blob trigger is a text file

```ts
import { binding, BaseFunction, functionName } from 'nammatham';

const bindings = [
  binding.blobTrigger({
    path: 'original-images/{name}',
    connection: 'BlobConnectionString',
    name: 'inputBlob' as const,
  }),
  binding.blob_output({
    path: 'resized-images/{name}',
    connection: 'BlobConnectionString',
    name: 'outputBlob' as const,
  }),
] as const;

@functionName('AutoResizeBlob', ...bindings)
export class AutoResizeBlobFunction extends BaseFunction<typeof bindings> {

  public override execute() {
    this.log('inputBlob:', JSON.stringify(this.bindings.inputBlob));
    this.log('inputBlob.toString():', this.bindings.inputBlob.toString());
    this.log('inputBlob.constructor.name:', this.bindings.inputBlob.constructor.name);
    this.log('bindingData:', JSON.stringify(this.context.bindingData))
    this.context.bindings.outputBlob = this.bindings.inputBlob; 
    }
}
```

if i upload text file, which content is `hey this is data`

blobtrigger type will be `buffer`
- inputblob: 
    ```json
    {"type":"buffer","data":[104,101,121,32,116,104,105,115,32,105,115,32,100,97,116,97]}
    ```
- inputblob.tostring(): `hey this is data` 
- inputblob.constructor.name: `Buffer`
- executioncontext:  
    ```json
    {
        "invocationid": "7c63ef83-1e4c-4750-9d23-7d3f634aab55",
        "functionname": "autoresizeblob",
        "functiondirectory": "/users/thadawangthammang/gits/personal/nammatham/examples/trigger-blob-output-blob/autoresizeblob",
        "retrycontext": null
    }
    ```
- bindingdata: 
    ```json
    {
        "invocationid": "7c63ef83-1e4c-4750-9d23-7d3f634aab55",
        "blobtrigger": "original-images/test3.txt",
        "uri": "https://mystorage.blob.core.windows.net/original-images/test3.txt",
        "properties": {
            "lastmodified": "2023-02-28t02:52:08+00:00",
            "createdon": "2023-02-28t02:52:08+00:00",
            "metadata": {},
            "objectreplicationdestinationpolicyid": null,
            "objectreplicationsourceproperties": null,
            "blobtype": 0,
            "copycompletedon": "0001-01-01t00:00:00+00:00",
            "copystatusdescription": null,
            "copyid": null,
            "copyprogress": null,
            "copysource": null,
            "copystatus": 0,
            "blobcopystatus": null,
            "isincrementalcopy": false,
            "destinationsnapshot": null,
            "leaseduration": 0,
            "leasestate": 0,
            "leasestatus": 1,
            "contentlength": 16,
            "contenttype": "text/plain",
            "etag": {},
            "contenthash": "k/yh6cwk/poolayi2t0bew==",
            "contentencoding": null,
            "contentdisposition": null,
            "contentlanguage": null,
            "cachecontrol": null,
            "blobsequencenumber": 0,
            "acceptranges": "bytes",
            "blobcommittedblockcount": 0,
            "isserverencrypted": true,
            "encryptionkeysha256": null,
            "encryptionscope": null,
            "accesstier": "hot",
            "accesstierinferred": true,
            "archivestatus": null,
            "accesstierchangedon": "0001-01-01t00:00:00+00:00",
            "versionid": null,
            "islatestversion": false,
            "tagcount": 0,
            "expireson": "0001-01-01t00:00:00+00:00",
            "issealed": false,
            "rehydratepriority": null,
            "lastaccessed": "0001-01-01t00:00:00+00:00",
            "immutabilitypolicy": {
                "expireson": null,
                "policymode": null
            },
            "haslegalhold": false
        },
        "metadata": {},
        "name": "test3.txt"
    }
    ```

## if blob trigger is an image file (png)

- inputblob.constructor.name: `Buffer`
- typeof inputBlob: `object`
- bindingdata: 
    ```json
    {
        "invocationId": "dceaf0b5-7919-496b-863f-9aad93eab653",
        "blobTrigger": "original-images/nammatham.png",
        "uri": "https://mystorage.blob.core.windows.net/original-images/nammatham.png",
        "properties": {
            "lastModified": "2023-02-28T03:15:41+00:00",
            "createdOn": "2023-02-28T03:15:41+00:00",
            "metadata": {},
            "objectReplicationDestinationPolicyId": null,
            "objectReplicationSourceProperties": null,
            "blobType": 0,
            "copyCompletedOn": "0001-01-01T00:00:00+00:00",
            "copyStatusDescription": null,
            "copyId": null,
            "copyProgress": null,
            "copySource": null,
            "copyStatus": 0,
            "blobCopyStatus": null,
            "isIncrementalCopy": false,
            "destinationSnapshot": null,
            "leaseDuration": 0,
            "leaseState": 0,
            "leaseStatus": 1,
            "contentLength": 489099,
            "contentType": "image/png",
            "eTag": {},
            "contentHash": "Frwz+n1bxnje9msg60EsHA==",
            "contentEncoding": null,
            "contentDisposition": null,
            "contentLanguage": null,
            "cacheControl": null,
            "blobSequenceNumber": 0,
            "acceptRanges": "bytes",
            "blobCommittedBlockCount": 0,
            "isServerEncrypted": true,
            "encryptionKeySha256": null,
            "encryptionScope": null,
            "accessTier": "Hot",
            "accessTierInferred": true,
            "archiveStatus": null,
            "accessTierChangedOn": "0001-01-01T00:00:00+00:00",
            "versionId": null,
            "isLatestVersion": false,
            "tagCount": 0,
            "expiresOn": "0001-01-01T00:00:00+00:00",
            "isSealed": false,
            "rehydratePriority": null,
            "lastAccessed": "0001-01-01T00:00:00+00:00",
            "immutabilityPolicy": {
                "expiresOn": null,
                "policyMode": null
            },
            "hasLegalHold": false
        },
        "metadata": {},
        "name": "nammatham.png"
    }
    ``` 