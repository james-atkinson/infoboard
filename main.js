const path = require('path');
const logger = require('./lib/logger');
const { startServer } = require('./server');

const handleServerError = (error) => {
  logger.error(error);
  logger.on('finish', () => process.exit(1));
  logger.end();
};

async function startup() {
  const serverOptions = {
    appKey: 'infoboard',
    port: '9100',
    root: path.resolve(__dirname, './public'),
  };
  startServer(serverOptions);
}

startup().catch(handleServerError);
