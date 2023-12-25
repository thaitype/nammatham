import { BaseHandlerResolver } from '../../bases';

export class DefaultHandlerResolver extends BaseHandlerResolver {
  override resolveHandler() {
    console.log(`Starting using default handler resolver`);
  }
}
