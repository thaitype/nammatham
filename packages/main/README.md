

# Local Dev

When bundle the nammatham with Hono, it'll error out with the following type error:

```
Property '#private' in type 'Context' refers to a different member that cannot be accessed from within type 'Context'.
```

## the solution

Exclude the hono as the external dependency in `tsup` config.

https://github.com/orgs/honojs/discussions/2215
