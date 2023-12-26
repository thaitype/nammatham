import pino from 'pino';
const isDevelopment = process.env.NODE_ENV === 'development';

export const _logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

class Logger {
  debug(...args: any[]) {
    if (isDevelopment) _logger.debug(args[0], ...args.slice(1));
    else console.debug(...args);
  }

  info(...args: any[]) {
    if (isDevelopment) _logger.info(args[0], ...args.slice(1));
    else console.info(...args);
  }

  warn(...args: any[]) {
    if (isDevelopment) _logger.warn(args[0], ...args.slice(1));
    else console.warn(...args);
  }

  error(...args: any[]) {
    if (isDevelopment) _logger.error(args[0], ...args.slice(1));
    else console.error(...args);
  }

  fatal(...args: any[]) {
    if (isDevelopment) _logger.fatal(args[0], ...args.slice(1));
    else console.error(args);
  }
}

export const logger = new Logger();
