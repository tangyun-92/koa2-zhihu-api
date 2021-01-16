const Router = require('koa-router')
const router = new Router({prefix: '/users'})
const db = [{name: 'lilei'}]

router.get('/', (ctx, next) => {
  ctx.body = [{ name: 'zs' }]
})

router.post('/', (ctx, next) => {
  ctx.body = [{ name: 'zs' }]
})

router.get('/:id', (ctx, next) => {
  ctx.body = [{ name: 'zs' }]
})

router.put('/:id', (ctx, next) => {
  ctx.body = [{ name: 'zs' }]
})

router.delete('/:id', (ctx, next) => {
  ctx.body = [{ name: 'zs' }]
})


module.exports = router