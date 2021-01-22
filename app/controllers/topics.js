/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:03
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-22 11:34:52
 */
const Topic = require('../models/topics')
const User = require('../models/users')
const Question = require('../models/questions')
const { secret } = require('../config')
const { returnCtxBody } = require('../utils')

class TopicsController {
  /**
   * 获取话题列表
   * @param {*} ctx
   */
  async getTopicList(ctx) {
    let { limit = 10, page = 1, searchCon } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const topics = await Topic.find()
      .find({ name: new RegExp(searchCon) })
      .limit(limit)
      .skip(page * limit)
    const total = topics.length
    ctx.body = returnCtxBody('获取成功', topics, total)
  }

  /**
   * 获取指定话题
   * @param {*} ctx
   */
  async getTopicInfo(ctx) {
    ctx.verifyParams({
      topicId: { type: 'string', required: true },
    })
    const topic = await Topic.findById(ctx.request.body.topicId).select(
      '+introduction'
    )
    if (!topic) {
      return ctx.throw(404, '话题不存在')
    }
    ctx.body = returnCtxBody('获取成功', topic)
  }

  /**
   * 创建话题
   * @param {*} ctx
   */
  async createTopic(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatarUrl: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const { name } = ctx.request.body
    const repeatedTopic = await Topic.findOne({ name })
    if (repeatedTopic) {
      return ctx.throw(409, '话题已存在')
    }
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = returnCtxBody('新增成功', topic)
  }

  /**
   * 更新话题
   * @param {*} ctx
   */
  async updateTopic(ctx) {
    ctx.verifyParams({
      answerId: { type: 'string', required: true },
      name: { type: 'string', required: false },
      avatarUrl: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const topic = await Topic.findByIdAndUpdate(
      ctx.request.body.answerId,
      ctx.request.body
    )
    const newTopic = await Topic.findById(ctx.request.body.answerId)
    if (!newTopic) {
      return ctx.throw(404, '话题不存在')
    }
    ctx.body = returnCtxBody('更新成功', newTopic)
  }

  /**
   * 话题关注者（粉丝）列表
   * @param {*} ctx
   */
  async topicsListFollowers(ctx) {
    ctx.verifyParams({
      topicId: { type: 'string', required: true },
    })
    const users = await User.find({ topic: ctx.request.body.topicId })
    ctx.body = returnCtxBody('查询成功', users)
  }

  /**
   * 话题下包含的问题列表
   * @param {*} ctx
   */
  async topicsIncludeQuestionList(ctx) {
    ctx.verifyParams({
      topicId: { type: 'string', required: true },
    })
    const questions = await Question.find({ topics: ctx.request.body.topicId })
    ctx.body = returnCtxBody('获取成功', questions)
  }
}

module.exports = new TopicsController()
