const ConfigController = require('./config');
const FetchDataController = require('./fetchData');

const registerRoutes = (expressApp, serverOptions) => {
  const config = new ConfigController();
  const fetch = new FetchDataController();
  expressApp
    .get('/serverStatus', (req, res) => res.json({ status: 'OK' }))
    .get('/api/config', (req, res) => config.getConfig(req, res))
    .get('/api/fetchData', (req, res) => fetch.fetchData(req, res))
    // For everything not found by another middleware or router, send the index file.
    // Don't put anything after this.
    .get(/^(?!.*api).*$/, (req, res) => res.sendFile('index.html', {
      root: serverOptions.root,
    }));
};

module.exports = {
  registerRoutes,
};
