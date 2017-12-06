require('babel-register')
require('babel-polyfill')

process.env.NODE_ENV = 'development'

process.env.HOST = '10.4.238.178:8415'

global.__DEBUG__ = true

global.__CLIENT__ = true

global.__SERVER__ = false


require('./koa-server')

