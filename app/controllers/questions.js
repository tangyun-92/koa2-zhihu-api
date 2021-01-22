/*
 * @Author: 唐云
 * @Date: 2021-01-20 17:02:21
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-22 10:53:11
 * 问题
 */
const Question = require('../models/questions')
const User = require('../models/users')
const { returnCtxBody } = require('../utils')

class QuestionController {
  /**
   * 获取问题列表
   * @param {*} ctx
   */
  async getQuestionList(ctx) {
    let { limit = 10, page = 1, searchCon } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const q = new RegExp(searchCon)
    const question = await Question.find({
      $or: [{ title: q }, { description: q }],
    })
      .limit(limit)
      .skip(page * limit)
    const total = question.length
    ctx.body = returnCtxBody('获取成功', question, total)
  }

  /**
   * 获取指定问题
   * @param {*} ctx
   */
  async getQuestionInfo(ctx) {
    ctx.verifyParams({
      questionId: { type: 'string', required: true },
    })
    const question = await Question.findById(ctx.request.body.questionId)
      .select('+introduction')
      .populate('questioner topics')
    if (!question) {
      return ctx.throw(404, '问题不存在')
    }
    ctx.body = returnCtxBody('获取成功', question)
  }

  /**
   * 创建问题
   * @param {*} ctx
   */
  async createQuestion(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
      topics: { type: 'array', required: false },
    })
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    }).save()
    ctx.body = returnCtxBody('创建成功', question)
  }

  /**
   * 更新问题
   * @param {*} ctx
   */
  async updateQuestion(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      topics: { type: 'array', required: false },
    })
    const question = await Question.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body
    )
    const newQuestion = await Question.findById(ctx.request.body.id)
    if (!newQuestion) {
      return ctx.throw(404, '问题不存在')
    }
    ctx.body = returnCtxBody('更新成功', newQuestion)
  }

  /**
   * 删除问题
   * @param {*} ctx
   */
  async deleteQuestion(ctx) {
    ctx.verifyParams({
      questionId: { type: 'string', required: true },
    })
    const question = await Question.findByIdAndRemove(ctx.request.body.questionId)
    if (!question) {
      return ctx.throw(404, '问题不存在')
    }
    ctx.body = returnCtxBody('删除成功')
  }
}

module.exports = new QuestionController()
