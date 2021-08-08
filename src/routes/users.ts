import Router from "koa-router";

export default (router:Router) => {
  router.get('/user', async function (ctx, next) {
    ctx.body = 'this a users response!';
  })
}
