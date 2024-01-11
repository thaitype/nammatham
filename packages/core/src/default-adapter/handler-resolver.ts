import { logger } from '../main';
import { BaseHandlerResolver } from '../bases';

export class DefaultHandlerResolver extends BaseHandlerResolver {
  override resolveHandler() {
    logger.info(`Starting using default handler resolver`);
  }

  override resolveRegisterHandler() {
    logger.info(`Starting using default register handler`);
  }

  override afterServerStarted() {
    logger.info(`Starting using default unregister handler`);
  }
}
