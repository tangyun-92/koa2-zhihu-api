/*
 * @Author: 唐云
 * @Date: 2021-01-21 16:30:23
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 22:12:29
 * 评论
 */
const Comment = require('../models/comments')
const User = require('../models/users')
const { returnCtxBody } = require('../utils')

class CommentController {
  /**
   * 获取评论列表
   * @param {*} ctx
   */
  async getCommentList(ctx) {
    ctx.verifyParams = {
      questionId: { type: 'string', required: true },
      answerId: { type: 'string', answerId: true },
    }
    let {
      limit = 10,
      page = 1,
      searchCon,
      questionId,
      answerId,
      rootCommentId
    } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const q = new RegExp(searchCon)
    const comment = await Comment.find({
      content: q,
      questionId,
      answerId,
      rootCommentId,
    })
      .limit(limit)
      .skip(page * limit)
      .populate('commentator replayTo')
    const total = comment.length
    console.log(comment)
    ctx.body = returnCtxBody('获取成功', comment, total)
  }

  /**
   * 获取指定评论
   * @param {*} ctx
   */
  async getCommentInfo(ctx) {
    ctx.verifyParams = {
      id: { type: 'string', required: true },
    }
    const comment = await Comment.findById(ctx.request.body.id)
      .select('+commentator')
      .populate('commentator')
    if (!comment) {
      return ctx.throw(404, '评论不存在')
    }
    ctx.body = returnCtxBody('获取成功', comment)
  }

  /**
   * 创建评论
   * @param {*} ctx
   */
  async createComment(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      questionId: { type: 'string', required: true },
      answerId: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replayTo: { type: 'string', required: false },
    })
    const comment = await new Comment({
      ...ctx.request.body,
      commentator: ctx.state.user._id,
    }).save()
    ctx.body = returnCtxBody('创建成功', comment)
  }

  /**
   * 更新评论
   * @param {*} ctx
   */
  async updateComment(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      content: { type: 'string', required: false },
      questionId: { type: 'string', required: true },
      answerId: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replayTo: { type: 'string', required: false },
    })
    const comment = await Comment.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body
    )
    const newComment = await Comment.findById(ctx.request.body.id)
    if (!newComment) {
      return ctx.throw(404, '评论不存在')
    }
    ctx.body = returnCtxBody('更新成功', newComment)
  }

  /**
   * 删除评论
   * @param {*} ctx
   */
  async deleteComment(ctx) {
    const comment = await Comment.findByIdAndRemove(ctx.request.body.id)
    if (!comment) {
      return ctx.throw(404, '评论不存在')
    }
    ctx.body = returnCtxBody('删除成功')
  }
}

module.exports = new CommentController()
