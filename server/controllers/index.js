const ConfigController = require('./config');

const registerRoutes = (expressApp, serverOptions) => {
  const config = new ConfigController();
  expressApp
    .get('/serverStatus', (req, res) => res.json({ status: 'OK' }))
    .get('/api/config', (req, res) => config.getConfig(req, res))
    // For everything not found by another middleware or router, send the index file.
    // Don't put anything after this.
    .get(/^(?!.*api).*$/, (req, res) => res.sendFile('index.html', {
      root: serverOptions.root,
    }));
};

module.exports = {
  registerRoutes,
};
