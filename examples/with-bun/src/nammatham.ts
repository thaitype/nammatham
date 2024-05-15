// Path: nammatham.ts
import { Nammatham } from "nammatham";


const app = new Nammatham({
  default: {
    httpTrigger: {
      authLevel: "function",
    }
  },
}) as any;

// Http Method without args
app.post("/test", (c: any) => c.json("list books"));

// Http Method with args
app.get(
  "/test",
  {
    authLevel: "function",
  },
  (c: any) => c.json("list books")
);

// Another Trigger basic with few type-safe
app.storageBlob(
  {
    name: "storageBlob",
    inputs: {
      blobInput: {
        type: "blobStorage",
        connection: "AzureWebJobsStorage",
        path: "demo-input/xxx.txt",
      },
    },
  },
  (c: any) => {
    c.json(c.inputs.blobInput);
  }
);

// Another Trigger advance  with strong type-safe, and helper utility
app.storageBlob(
  ({ input, output }: any) => ({
    name: "storageBlob",
    inputs: {
      blobInput: input.blob({
        connection: "AzureWebJobsStorage",
        path: "demo-input/xxx.txt",
      }),
      blogOutput: output.blob({
        connection: 'AzureWebJobsStorage',
        path: 'demo-output/xxx-{rand-guid}.txt',
      }),
    },
  }),
  (c: any) => {
    c.json(c.inputs.blobInput);
  }
);

export default app;