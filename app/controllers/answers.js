/*
 * @Author: 唐云
 * @Date: 2021-01-21 16:30:23
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 16:53:44
 * 答案
 */
const Answer = require('../models/answers')
const User = require('../models/users')
const { returnCtxBody } = require('../utils')

class AnswerController {
  /**
   * 获取答案列表
   * @param {*} ctx
   */
  async getAnswerList(ctx) {
    ctx.verifyParams = {
      questionId: { type: 'string', required: true },
    }
    let { limit = 10, page = 1, searchCon, questionId } = ctx.request.body
    if (!questionId) {
      return ctx.throw(404, '该问题不存在')
    }
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const q = new RegExp(searchCon)
    const answer = await Answer.find({
      $or: [{ content: q }, { questionId }],
    })
      .limit(limit)
      .skip(page * limit)
    const total = answer.length
    ctx.body = returnCtxBody('获取成功', answer, total)
  }

  /**
   * 获取指定答案
   * @param {*} ctx
   */
  async getAnswerInfo(ctx) {
    ctx.verifyParams = {
      id: { type: 'string', required: true },
    }
    const answer = await Answer.findById(ctx.request.body.id)
      .select('+introduction')
      .populate('answerer')
    if (!answer) {
      return ctx.throw(404, '答案不存在')
    }
    ctx.body = returnCtxBody('获取成功', answer)
  }

  /**
   * 创建答案
   * @param {*} ctx
   */
  async createAnswer(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      questionId: { type: 'string', required: true },
    })
    const answer = await new Answer({
      ...ctx.request.body,
      answerer: ctx.state.user._id,
    }).save()
    ctx.body = returnCtxBody('创建成功', answer)
  }

  /**
   * 更新答案
   * @param {*} ctx
   */
  async updateAnswer(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      content: { type: 'string', required: false },
      questionId: { type: 'string', required: true },
    })
    const answer = await Answer.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body
    )
    const newAnswer = await Answer.findById(ctx.request.body.id)
    if (!newAnswer) {
      return ctx.throw(404, '答案不存在')
    }
    ctx.body = returnCtxBody('更新成功', newAnswer)
  }

  /**
   * 删除答案
   * @param {*} ctx
   */
  async deleteAnswer(ctx) {
    const answer = await Answer.findByIdAndRemove(ctx.request.body.id)
    if (!answer) {
      return ctx.throw(404, '答案不存在')
    }
    ctx.body = returnCtxBody('删除成功')
  }
}

module.exports = new AnswerController()
