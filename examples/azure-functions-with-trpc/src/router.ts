import { AzureFunctionsContextOption } from 'trpc-azure-functions-adapter';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';

export function createContext({ context, request }: AzureFunctionsContextOption) {
  return {
    context,
    request,
  };
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;

export const appRouter = t.router({
  greet: publicProcedure.query(({ input, ctx }) => {
    console.log(ctx.request.params);

    return `Greetings, `;
  }),
});

export type AppRouter = typeof appRouter;
