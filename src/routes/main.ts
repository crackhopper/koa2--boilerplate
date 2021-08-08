import Router from "koa-router";
export default (router:Router) => {
  router.get('/welcome', async function (ctx:any, next) {
    ctx.state = {
      title: 'koa2 title'
    };

    await ctx.render('welcome', {title: ctx.state});
  })
}
