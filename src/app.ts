import Koa from 'koa'
import websocketify from 'koa-websocket'
const app = websocketify(new Koa())

const views = require('koa-views')
import json from 'koa-json'
const onerror = require('koa-onerror')
import bodyparser from 'koa-bodyparser'
import Logger from 'koa-logger'
import Debug from 'debug'
const debug = Debug('app:app')
import path from 'path'

import config from './config'

const port = process.env.PORT || config.port

// error handler
onerror(app)

debug('booting app...')
// middlewares
app.use(bodyparser())
  .use(json())
  .use(Logger())
  .use(require('koa-static')(__dirname + '../public'))
  .use(views(path.join(__dirname, '../views'), {
    options: {settings: {views: path.join(__dirname, '../views')}},
    map: {'njk': 'nunjucks'},
    extension: 'njk'
  }))

import {root_router, v1_router} from './routes'
import { GlobalState } from './state'
app.use(root_router.routes())
  .use(root_router.allowedMethods())
app.use(v1_router.routes())
  .use(v1_router.allowedMethods())

// mock 拦截
import {socket_handler} from './controller/socket_controller'
app.ws.use(socket_handler)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = (new Date()).valueOf() - start.valueOf()
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

app.on('error', function(err, ctx) {
  debug(err)
})

module.exports = app.listen(config.port, async () => {
  await GlobalState.instance().async_init()
  console.log(`Listening on http://localhost:${config.port}`)
})
