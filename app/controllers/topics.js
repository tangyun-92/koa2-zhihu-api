/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:03
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 10:48:25
 */
const jsonwebtoken = require('jsonwebtoken')

const Topic = require('../models/topics')
const { secret } = require('../config')
const { returnCtxBody } = require('../utils')

class TopicsController {
  /**
   * 获取话题列表
   * @param {*} ctx
   */
  async getTopicList(ctx) {
    let { limit = 10, page } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const topics = await Topic.find()
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
    ctx.verifyParams = {
      id: { type: 'string', required: true },
    }
    const topic = await Topic.findById(ctx.request.body.id).select(
      '+introduction'
    )
    ctx.body = returnCtxBody('获取成功', topic)
  }

  /**
   * 创建话题
   * @param {*} ctx
   */
  async createTopic(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = returnCtxBody('新增成功', topic)
  }

  /**
   * 更新话题
   * @param {*} ctx
   */
  async updateTopic(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const topic = await Topic.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body
    )
    const newTopic = await Topic.findById(ctx.request.body.id)
    ctx.body = returnCtxBody('更新成功', newTopic)
  }
}

module.exports = new TopicsController()
