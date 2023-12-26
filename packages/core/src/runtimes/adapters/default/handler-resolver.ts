import { BaseHandlerResolver } from '../../bases';

export class DefaultHandlerResolver extends BaseHandlerResolver {
  override resolveHandler() {
    console.log(`Starting using default handler resolver`);
  }

  override resolveRegisterHandler() {
    console.log(`Starting using default register handler`);
  }
}
