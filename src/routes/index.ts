import Router from "koa-router";

import UsersRouter from './users'
import MainRouter from './main'

const root_router = new Router()
root_router.get('/', async (ctx:any, next) => {
  // ctx.body = 'Hello World'
  ctx.state = {
    title: 'Koa2'
  }
  await ctx.render('index', ctx.state)
})

const v1_router = new Router({prefix:'/v1'})
UsersRouter(v1_router)
MainRouter(v1_router)
export {root_router, v1_router}
