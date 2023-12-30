import { BaseHandlerResolver } from '../bases';
import { logger } from '../main';

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
