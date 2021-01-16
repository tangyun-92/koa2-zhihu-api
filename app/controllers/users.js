const db = [{ name: 'zs' }]

class UsersController {
  find(ctx) {
    ctx.body = db
  }
  findById(ctx) {
    if (ctx.params.id * 1 >= db.length) {
      ctx.throw(412, '先决条件失败，id大于等于数组长度了')
    }
    ctx.body = db[ctx.params.id * 1]
  }
  create(ctx) {
    // 参数校验
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false },
    })
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  update(ctx) {
    // 参数校验
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false },
    })
    db[ctx.params.id * 1] = ctx.request.body
    ctx.body = ctx.request.body
  }
  delete(ctx) {
    db.splice(ctx.params.id * 1, 1)
    ctx.status = 204
  }
}

module.exports = new UsersController()
