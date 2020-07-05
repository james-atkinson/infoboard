const axios = require('axios');
const logger = require('../../lib/logger');

module.exports = class FetchDataController {
  async fetchData(request, response) { // eslint-disable-line
    const requestedUrl = decodeURI(request.query.url || null);
    logger.info(`Request for /api/fetchData, request url: ${requestedUrl}`);

    try {
      const data = requestedUrl ? await axios.get(requestedUrl) : {};
      response.status(200).send(data.data);
    } catch (e) {
      logger.error(`Error fetching ${requestedUrl} reason: ${e}`);
      response.status(200).send({});
    }
  }
};
