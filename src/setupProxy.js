const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'https://route-api.dodoex.io/dodoapi/getdodoroute',
            changeOrigin: true,
        })
    )
}