import { createLogger, format, transports } from 'winston';

const isProd = process.env.NODE_ENV === 'production';

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  format: isProd
    ? format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      )
    : format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
          return `${timestamp} ${level}: ${message}${metaString}`;
        })
      ),
  transports: [new transports.Console()],
  exitOnError: false
});

process.on('unhandledRejection', (reason) => {
  logger.error({ message: 'Unhandled promise rejection', reason });
});

process.on('uncaughtException', (err) => {
  logger.error({ message: 'Uncaught exception', stack: err.stack });
});

export default logger;