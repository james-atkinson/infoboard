const logger = require('../../lib/logger');
const themeConfig = require('../../src/themes/config.json');

module.exports = class ConfigController {
  getConfig(request, response) { // eslint-disable-line
    logger.info(`Request for /api/config, configured theme ${themeConfig.theme}`);
    const configuredThemeConfig = require(`../../src/themes/${themeConfig.theme}/config.json`); // eslint-disable-line
    response.status(200).json({
      configuredThemeConfig,
    });
  }
};
