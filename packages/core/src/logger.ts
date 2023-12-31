import pino from 'pino';
const isDevelopment = process.env.NAMMATHAM_ENV === 'development';

export const _logger = pino({
  level: process.env.NAMMATHAM_LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

abstract class BaseLogger {
  abstract debug(...args: any[]): void;
  abstract info(...args: any[]): void;
  abstract warn(...args: any[]): void;
  abstract error(...args: any[]): void;
  abstract fatal(...args: any[]): void;
}

class PinoLogger extends BaseLogger {
  constructor(private readonly logger: pino.Logger) {
    super();
  }

  debug(...args: any[]) {
    this.logger.debug(args[0], ...args.slice(1));
  }

  info(...args: any[]) {
    this.logger.info(args[0], ...args.slice(1));
  }

  warn(...args: any[]) {
    this.logger.warn(args[0], ...args.slice(1));
  }

  error(...args: any[]) {
    this.logger.error(args[0], ...args.slice(1));
  }

  fatal(...args: any[]) {
    this.logger.fatal(args[0], ...args.slice(1));
  }
}

class ConsoleLogger extends BaseLogger {
  debug(...args: any[]) {
    console.debug(...args);
  }

  info(...args: any[]) {
    console.info(...args);
  }

  warn(...args: any[]) {
    console.warn(...args);
  }

  error(...args: any[]) {
    console.error(...args);
  }

  fatal(...args: any[]) {
    console.error(...args);
  }
}

export const logger: BaseLogger = isDevelopment ? new PinoLogger(_logger): new ConsoleLogger();
