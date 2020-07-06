const path = require('path');
const logger = require('../../lib/logger');
const themeConfig = require('../../src/themes/config.json');

module.exports = class ConfigController {
  getConfig(request, response) { // eslint-disable-line
    logger.info(`Request for /api/config, configured theme ${themeConfig.theme}`);
    const configuredThemeConfigPath = `${path.resolve(__dirname, '../../')}/src/themes/${themeConfig.theme}/config.json`;
    response.status(200).sendFile(configuredThemeConfigPath);
  }
};
