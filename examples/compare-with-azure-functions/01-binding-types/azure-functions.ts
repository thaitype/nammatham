import { Context } from '@azure/functions';

const myFunction = async function (context: Context) {
  const { req } = context.bindings;
  //       ^?
};

export default myFunction;
