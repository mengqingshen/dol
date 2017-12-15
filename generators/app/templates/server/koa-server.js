import Koa from 'koa'
import log from 'npmlog'
import logger from 'koa-logger'
import CSRF from 'koa-csrf'
import session from 'koa-session'
import proxyMiddleware from 'http-proxy-middleware'
import c2k from 'koa-connect'

import config from '../.yo-rc.json'

import webpackServer from './webpack-server.js'

const proxyConfig = config['generator-rick'].proxy

const PORT = 3000
const app = new Koa()

app.use(logger())
app.use(session(app))


app.use(new CSRF({}))

// 代理至 webpack-server
app.use(c2k(proxyMiddleware(proxyConfig.static.rule, proxyConfig.static.options)))

// 代理至 中间层 dev
if (proxyConfig.api) app.use(c2k(proxyMiddleware(proxyConfig.api.rule, proxyConfig.api.options)))

app.on('error', (err) => {
  log.error(err.stack)
})

// 启动 koa
const run = () => {
  app.listen(PORT, (error) => {
    if (error) {
      log.error(error)
    } else {
      log.info(`==> Listening on port ${PORT}.`)
    }
  })
}

webpackServer(run)
