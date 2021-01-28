/*
 * @Author: 唐云
 * @Date: 2021-01-20 17:02:21
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-28 16:58:21
 * 文章
 */
const Article = require('../models/articles')
const User = require('../models/users')
const { returnCtxBody } = require('../utils')

class ArticleController {
  /**
   * 获取文章列表
   * @param {*} ctx
   */
  async getArticleList(ctx) {
    let { limit = 10, page = 1, searchCon } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const q = new RegExp(searchCon)
    const article = await Article.find({
      $or: [{ title: q }],
    })
      .limit(limit)
      .skip(page * limit)
    const total = article.length
    ctx.body = returnCtxBody('获取成功', article, total)
  }

  /**
   * 获取指定文章
   * @param {*} ctx
   */
  async getArticleInfo(ctx) {
    ctx.verifyParams({
      articleId: { type: 'string', required: true },
    })
    const article = await Article.findById(ctx.request.body.articleId)
      .populate('articleUser column')
    if (!article) {
      return ctx.throw(404, '文章不存在')
    }
    ctx.body = returnCtxBody('获取成功', article)
  }

  /**
   * 创建文章
   * @param {*} ctx
   */
  async createArticle(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      content: { type: 'string', required: false },
      image: { type: 'string', required: false },
      columnId: { type: 'string', required: true },
    })
    const article = await new Article({
      ...ctx.request.body,
      column: ctx.request.body.columnId,
      articleUser: ctx.state.user._id,
    }).save()
    ctx.body = returnCtxBody('创建成功', article)
  }

  /**
   * 更新文章
   * @param {*} ctx
   */
  async updateArticle(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      content: { type: 'string', required: false },
      image: { type: 'string', required: false },
      columnId: { type: 'string', required: false },
      articleId: { type: 'string', required: true },
    })
    const article = await Article.findByIdAndUpdate(
      ctx.request.body.articleId,
      ctx.request.body
    )
    const newArticle = await Article.findById(ctx.request.body.articleId)
    if (!newArticle) {
      return ctx.throw(404, '文章不存在')
    }
    ctx.body = returnCtxBody('更新成功', newArticle)
  }

  /**
   * 删除文章
   * @param {*} ctx
   */
  async deleteArticle(ctx) {
    ctx.verifyParams({
      articleId: { type: 'string', required: true },
    })
    const article = await Article.findByIdAndRemove(ctx.request.body.articleId)
    if (!article) {
      return ctx.throw(404, '文章不存在')
    }
    ctx.body = returnCtxBody('删除成功')
  }
}

module.exports = new ArticleController()
