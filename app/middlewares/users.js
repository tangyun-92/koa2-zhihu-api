/*
 * @Author: 唐云
 * @Date: 2021-01-19 22:30:54
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-22 15:10:43
 */
const User = require('../models/users')

class userMiddleware {
  /**
   * 授权的中间件
   * @param {*} ctx
   * @param {*} next
   */
  async checkOwner(ctx, next) {
    if (ctx.request.body.userId !== ctx.state.user._id) {
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
      userId: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    await next()
  }
}

module.exports = new userMiddleware()
