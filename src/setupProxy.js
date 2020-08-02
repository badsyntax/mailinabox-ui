/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');

module.exports = function (app) {
  app.use(
    '/admin',
    createProxyMiddleware({
      target: `https://${config.hostname}`,
      changeOrigin: true,
    })
  );
};
