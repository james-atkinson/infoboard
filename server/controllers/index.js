const registerRoutes = (expressApp, serverOptions) => {
  expressApp
    .get('/serverStatus', (req, res) => res.json({ status: 'OK' }))
    // For everything not found by another middleware or router, send the index file.
    // Don't put anything after this.
    .get(/^(?!.*api).*$/, (req, res) => res.sendFile('index.html', {
      root: serverOptions.root,
    }));
};

module.exports = {
  registerRoutes,
};
