// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/admin',
    createProxyMiddleware({
      target: 'https://box.proxima-mail.com',
      changeOrigin: true,
    })
  );
};
