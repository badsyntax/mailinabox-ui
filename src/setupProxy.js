/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config/config.json');

module.exports = function (app) {
  app.use(
    '/admin',
    createProxyMiddleware({
      target: `https://${config.hostname}`,
      changeOrigin: true,
    })
  );
};
