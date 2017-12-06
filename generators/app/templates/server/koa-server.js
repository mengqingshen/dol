import Koa from 'koa'
import log from 'npmlog'
import logger from 'koa-logger'
// import path from 'path'
// import koaStatic from 'koa-static-server'
import CSRF from 'koa-csrf'
import session from 'koa-session'
import proxyMiddleware from 'http-proxy-middleware'
import c2k from 'koa-connect'

// import sso from './middlewares/sso.js'
// import upm from './middlewares/upm.js'

import webpackServer from './webpack-server.js'

const PORT = 3000

const app = new Koa()
// const userMap = {}
// app.use((ctx, next) => {
//   ctx.userMap = userMap
//   next()
// })

// const userMap = {}

// app.use(async (ctx, next) => {
//   ctx.userMap = userMap
//   await next()
// })

app.use(logger())
app.use(session(app))


app.use(new CSRF({}))

// 执行sso登录认证
// app.use(sso)

// upm 权限验证
// app.use(upm)

// 代理至本地文件
// app.use(koaStatic({
//   rootDir: path.join(__dirname, '../../build/'),
//   index: 'html/task-list.html'
// }))

// 代理至 webpack-server
app.use(c2k(proxyMiddleware(['**/*.html', '**/*.js', '**/*.css'], {
  target: 'http://localhost:3001',
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: {
    '^/mfepro/channel_crm': '/html'
  }
})))

// 代理至 中间层 dev
app.use(c2k(proxyMiddleware(['/mfepro/xianfu/channel/uicomponent/api/**', '/agent/**'], {
  target: 'http://mfe.waimai.dev.sankuai.com',
  changeOrigin: true,
  logLevel: 'debug'
})))

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
