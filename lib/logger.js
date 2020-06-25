const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`); // eslint-disable-line

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat,
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
  ],
});

const error = (message) => logger.log('error', message);
const info = (message) => logger.log('info', message);
const warn = (message) => logger.log('warn', message);
const debug = (message) => logger.log('debug', message);

module.exports = {
  rawLogger: logger,
  error,
  info,
  warn,
  debug,
};
