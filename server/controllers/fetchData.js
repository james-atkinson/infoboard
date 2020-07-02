const axios = require('axios');
const logger = require('../../lib/logger');

module.exports = class FetchDataController {
  async fetchData(request, response) { // eslint-disable-line
    const requestedUrl = request.query.url || null;
    logger.info(`Request for /api/fetchData, request url: ${requestedUrl}`);

    const data = requestedUrl ? await axios.get(requestedUrl) : {};

    response.status(200).send(data.data);
  }
};
