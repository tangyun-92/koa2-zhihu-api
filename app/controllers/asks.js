/*
 * @Author: 唐云
 * @Date: 2021-01-20 17:02:21
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 17:30:22
 */
const Ask = require('../models/asks')
const User = require('../models/users')
const { returnCtxBody } = require('../utils')

class AskController {
  /**
   * 获取问答列表
   * @param {*} ctx
   */
  async getAskList(ctx) {
    let { limit = 10, page = 1 } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const asks = await Ask.find()
      .limit(limit)
      .skip(page * limit)
    const total = asks.length
    ctx.body = returnCtxBody('获取成功', asks, total)
  }

  /**
   * 创建问答
   * @param {*} ctx 
   */
  async createAsk(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
      content: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    const ask = await new Ask(ctx.request.body).save()
    ctx.body = returnCtxBody('创建成功', ask)
  }
}

module.exports = new AskController()
