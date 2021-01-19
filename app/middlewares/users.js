const User = require('../models/users')

class userMiddleware {
  /**
   * 授权的中间件
   * @param {*} ctx
   * @param {*} next
   */
  async checkOwner(ctx, next) {
    if (ctx.request.body.id !== ctx.state.user._id) {
      return ctx.throw(403, '没有权限')
    }
    await next()
  }

  /**
   * 校验用户是否存在的中间件
   * @param {*} ctx
   * @param {*} next
   */
  async checkUserExist(ctx, next) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.id)
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    await next()
  }
}

module.exports = new userMiddleware()