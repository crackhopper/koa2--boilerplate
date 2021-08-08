import Koa from 'koa'
import Router from 'koa-router'
const app = new Koa()
const router = new Router()

const views = require('koa-views')
import json from 'koa-json'
const onerror = require('koa-onerror')
import bodyparser from 'koa-bodyparser'
import Logger from 'koa-logger'
import Debug from 'debug'
const debug = Debug('app:app')
import path from 'path'

const config = require('./config')
const routes = require('./routes')

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
  .use(router.routes())
  .use(router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = (new Date()).valueOf() - start.valueOf()
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

router.get('/', async (ctx:any, next) => {
  // ctx.body = 'Hello World'
  ctx.state = {
    title: 'Koa2'
  }
  await ctx.render('index', ctx.state)
})

routes(router)
app.on('error', function(err, ctx) {
  debug(err)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
