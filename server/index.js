const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require('http');


const logger = require('../lib/logger');
const { registerRoutes } = require('./controllers');

const handleServerError = (error, appOptions) => {
  logger.error(`[${appOptions.appKey}] Express server errored while starting or running. Message: ${error.message}`);
  logger.error(error);
  logger.on('finish', () => {
    process.exit(1);
  });
  logger.end();
};

const createExpressServer = (serverOptions) => {
  const expressApp = express();

  expressApp.use(cors({
    origin: "http://localhost:9100"
  }));

  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: true }));

  registerRoutes(expressApp, serverOptions);

  const expressServer = http.createServer(
    serverOptions.httpServerConfig || {}, expressApp,
  );
  return expressServer;
};

const startServer = (serverOptions) => (
  new Promise((resolve, reject) => {
    logger.info(`[${serverOptions.appKey}] Starting up server...`);

    const server = createExpressServer(serverOptions);
    const { port } = serverOptions;

    server.listen(port, () => {
      logger.info(`[${serverOptions.appKey}] Server started on port ${port}`);
      resolve(server);
    }).on('error', (err) => {
      handleServerError(err, serverOptions);
      reject(err);
    });
  })
);

module.exports = {
  startServer,
};
