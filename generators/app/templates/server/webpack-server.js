import webpack from 'webpack'
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'


import Koa from 'koa'

import log from 'npmlog'
import _ from 'lodash'

import config from '../build/webpack.config.dev'

const app = new Koa()
const compiler = webpack(config)

const port = 3001

export default (callback) => {
  const init = _.once(callback)
  compiler.plugin('after-emit', (compile, cb) => {
    cb()
    init()
  })

  app.use(devMiddleware(compiler, {
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }))

  app.use(hotMiddleware(compiler))

  app.listen(port, (err) => {
    if (err) {
      log.error('webpack dev server 务启动错误', err)
      return
    }
    log.info(`webpack dev server listening on ${port}`)
  })
}
