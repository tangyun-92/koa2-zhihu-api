/*
 * @Author: 唐云
 * @Date: 2021-01-28 16:13:28
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-28 22:32:09
 * 专栏
 */
const Column = require('../models/columns')
const Article = require('../models/articles')
const { returnCtxBody } = require('../utils')

class ColumnController {
  /**
   * 获取专栏列表
   * @param {*} ctx
   */
  async getColumnList(ctx) {
    let { limit = 10, page = 1, searchCon } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const q = new RegExp(searchCon)
    const column = await Column.find({
      $or: [{ title: q }],
    })
      .limit(limit)
      .skip(page * limit)
    const total = column.length
    ctx.body = returnCtxBody('获取成功', column, total)
  }

  /**
   * 获取专栏详情
   * @param {*} ctx
   */
  async getColumnInfo(ctx) {
    ctx.verifyParams({
      columnId: { type: 'string', required: true },
    })
    const column = await Column.findById(ctx.request.body.columnId).populate(
      'columnUser'
    )
    if (!column) {
      return ctx.throw(404, '专栏不存在')
    }
    ctx.body = returnCtxBody('获取成功', column)
  }

  /**
   * 创建专栏
   * @param {*} ctx
   */
  async createColumn(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
      avatar: { type: 'string', required: false },
    })
    const column = await new Column({
      ...ctx.request.body,
      columnUser: ctx.state.user._id,
    }).save()
    ctx.body = returnCtxBody('创建成功', column)
  }

  /**
   * 更新专栏
   * @param {*} ctx
   */
  async updateColumn(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      avatar: { type: 'string', required: false },
    })
    const column = await Column.findByIdAndUpdate(
      ctx.request.body.columnId,
      ctx.request.body
    )
    const newColumn = await Column.findById(ctx.request.body.columnId)
    if (!newColumn) {
      return ctx.throw(404, '专栏不存在')
    }
    ctx.body = returnCtxBody('更新成功', newColumn)
  }

  /**
   * 删除专栏
   * @param {*} ctx
   */
  async deleteColumn(ctx) {
    ctx.verifyParams({
      columnId: { type: 'string', required: true },
    })
    const column = await Column.findByIdAndRemove(ctx.request.body.columnId)
    if (!column) {
      return ctx.throw(404, '专栏不存在')
    }
    ctx.body = returnCtxBody('删除成功')
  }

  /**
   * 专栏下文章列表
   * @param {*} ctx
   */
  async columnArticleList(ctx) {
    ctx.verifyParams({
      columnId: { type: 'string', required: true },
    })
    const articles = await Article.find({ column: ctx.request.body.columnId })
    ctx.body = returnCtxBody('获取成功', articles)
  }
}

module.exports = new ColumnController()
