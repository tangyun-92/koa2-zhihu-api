const Router = require('koa-router')
const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = '这是主页'
})

module.exports = router