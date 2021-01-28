/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:03
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-28 17:19:31
 */
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const Column = require('../models/columns')
const Article = require('../models/articles')
const { secret } = require('../config')
const { returnCtxBody } = require('../utils')

class UsersController {
  /**
   * 查询用户列表
   * @param {*} ctx
   */
  async getUserList(ctx) {
    let { limit = 10, page, searchCon } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const users = await User.find()
      .find({ name: new RegExp(searchCon) })
      .limit(limit)
      .skip(page * limit)
    const total = users.length
    ctx.body = returnCtxBody('查询成功', users, total, 1, 200)
  }

  /**
   * 查找指定用户
   * @param {*} ctx
   */
  async getUserInfo(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const id = ctx.request.body.userId
    const user = await User.findById(id)
      .select('+employments +educations')
      .populate(
        'locations business employments.company employments.job educations.school educations.major'
      )
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', user)
  }

  /**
   * 创建用户
   * @param {*} ctx
   */
  async createUser(ctx) {
    // 参数校验
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) {
      return ctx.throw(409, '用户名已存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = returnCtxBody('创建用户成功', user)
  }

  /**
   * 更新用户信息
   * @param {*} ctx
   */
  async updateUserInfo(ctx) {
    // 参数校验
    ctx.verifyParams({
      userId: { type: 'string', required: true },
      name: { type: 'string', required: false },
      avatarUrl: { type: 'string', required: false },
      banner_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    })
    const user = await User.findByIdAndUpdate(
      ctx.request.body.userId,
      ctx.request.body
    )
    const dbUser = await User.findById(ctx.request.body.userId).select(
      '+educations +locations +business +employments'
    )
    ctx.body = returnCtxBody('更新成功', dbUser)
  }

  /**
   * 删除指定用户
   * @param {*} ctx
   */
  async deleteUser(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const user = await User.findByIdAndRemove(ctx.request.body.userId)
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('删除成功')
  }

  /**
   * 登录
   * @param {*} ctx
   */
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      return ctx.throw(401, '用户名或密码不正确')
    }
    const { _id, name } = user
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = {
      code: 1,
      status: 200,
      message: '登录成功',
      token,
    }
  }

  /**
   * 获取他关注的人列表
   * @param {*} ctx
   */
  async interestList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
      .select('+following')
      .populate('following')
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', user.following)
  }

  /**
   * 获取关注他的人列表
   * @param {*} ctx
   */
  async fanList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const users = await User.find({ following: ctx.request.body.userId })
    if (!users) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', users)
  }

  /**
   * 关注
   * @param {*} ctx
   */
  async follow(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const me = await User.findById(ctx.state.user._id).select('+following')
    // map方法表示将mongoose中的数据类型先转为字符串再判断是否存在
    if (
      !me.following.map((id) => id.toString()).includes(ctx.request.body.userId)
    ) {
      me.following.push(ctx.request.body.userId)
      me.save()
      ctx.body = returnCtxBody('关注成功')
    } else {
      ctx.throw(405, '您已经关注过了')
    }
  }

  /**
   * 取消关注
   * @param {*} ctx
   */
  async unFollow(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following
      .map((id) => id.toString())
      .indexOf(ctx.request.body.userId) // 获取要取消关注人在列表中的索引
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.body = returnCtxBody('取消关注成功')
  }

  /**
   * 修改密码
   * @param {*} ctx
   */
  async updatePassword(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
      oldPassword: { type: 'string', required: true },
      newPassword: { type: 'string', required: true },
    })
    const { userId, oldPassword, newPassword } = ctx.request.body
    const data = await User.findById(userId).select('+password')
    if (data.password !== oldPassword) {
      return ctx.throw(404, '旧密码不正确')
    }
    let password = newPassword
    await User.findByIdAndUpdate(userId, { password })
    ctx.body = returnCtxBody('修改密码成功')
  }

  /**
   * 关注话题
   * @param {*} ctx
   */
  async followerTopic(ctx) {
    ctx.verifyParams({
      topicId: { type: 'string', required: true },
    })
    const me = await User.findById(ctx.state.user._id).select('+topic')
    // map方法表示将mongoose中的数据类型先转为字符串再判断是否存在
    if (
      !me.topic.map((id) => id.toString()).includes(ctx.request.body.topicId)
    ) {
      me.topic.push(ctx.request.body.topicId)
      me.save()
      ctx.body = returnCtxBody('关注成功')
    } else {
      ctx.throw(405, '您已经关注过了')
    }
  }

  /**
   * 取消关注话题
   * @param {*} ctx
   */
  async unFollowerTopic(ctx) {
    ctx.verifyParams({
      topicId: { type: 'string', required: true },
    })
    const me = await User.findById(ctx.state.user._id).select('+topic')
    const index = me.topic
      .map((id) => id.toString())
      .indexOf(ctx.request.body.topicId) // 获取要取消关注话题在列表中的索引
    if (index > -1) {
      me.topic.splice(index, 1)
      me.save()
    }
    ctx.body = returnCtxBody('取消关注成功')
  }

  /**
   * 获取用户关注的话题列表
   * @param {*} ctx
   */
  async followerTopicList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
      .select('+topic')
      .populate('topic')
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', user.topic)
  }

  /**
   * 获取用户提问列表
   * @param {*} ctx
   */
  async questionsList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const questions = await Question.find({
      questioner: ctx.request.body.userId,
    })
    ctx.body = returnCtxBody('获取成功', questions)
  }

  /**
   * 获取用户赞过的答案
   * @param {*} ctx
   */
  async likeAnswerList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
      .select('+likingAnswers')
      .populate('likingAnswers')
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', user.likingAnswers)
  }

  /**
   * 赞问题的答案
   * @param {*} ctx
   */
  async likeAnswer(ctx, next) {
    const answerId = ctx.request.body.answerId
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    // map方法表示将mongoose中的数据类型先转为字符串再判断是否存在
    if (!me.likingAnswers.map((id) => id.toString()).includes(answerId)) {
      me.likingAnswers.push(answerId)
      me.save()
      await Answer.findByIdAndUpdate(answerId, { $inc: { voteCount: 1 } }) // 表示点赞加1
      ctx.body = returnCtxBody('成功')
    } else {
      ctx.throw(409, '您已经赞过了')
    }
    await next()
  }

  /**
   * 取消赞问题的答案
   * @param {*} ctx
   */
  async unLikeAnswer(ctx) {
    const answerId = ctx.request.body.answerId
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const index = me.likingAnswers.map((id) => id.toString()).indexOf(answerId)
    if (index > -1) {
      me.likingAnswers.splice(index, 1)
      me.save()
      await Answer.findByIdAndUpdate(answerId, { $inc: { voteCount: -1 } })
    }
    ctx.body = returnCtxBody('成功')
  }

  /**
   * 获取用户踩过的答案
   * @param {*} ctx
   */
  async dislikeAnswerList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
      .select('+disLikingAnswers')
      .populate('disLikingAnswers')
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', user.disLikingAnswers)
  }

  /**
   * 踩问题的答案
   * @param {*} ctx
   */
  async dislikeAnswer(ctx, next) {
    const answerId = ctx.request.body.answerId
    const me = await User.findById(ctx.state.user._id).select(
      '+disLikingAnswers'
    )
    if (!me.disLikingAnswers.map((id) => id.toString()).includes(answerId)) {
      me.disLikingAnswers.push(answerId)
      me.save()
    }
    ctx.body = returnCtxBody('成功')
    await next()
  }

  /**
   * 取消踩问题的答案
   * @param {*} ctx
   */
  async unDislikeAnswer(ctx) {
    const answerId = ctx.request.body.answerId
    const me = await User.findById(ctx.state.user._id).select(
      '+disLikingAnswers'
    )
    const index = me.disLikingAnswers
      .map((id) => id.toString())
      .indexOf(answerId)
    if (index > -1) {
      me.disLikingAnswers.splice(index, 1)
      me.save()
    }
    ctx.body = returnCtxBody('成功')
  }

  /**
   * 获取用户收藏的答案
   * @param {*} ctx
   */
  async collectAnswerList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
      .select('+collectingAnswers')
      .populate('collectingAnswers')
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', user.collectingAnswers)
  }

  /**
   * 收藏答案
   * @param {*} ctx
   */
  async collectAnswer(ctx, next) {
    const answerId = ctx.request.body.answerId
    const me = await User.findById(ctx.state.user._id).select(
      '+collectingAnswers'
    )
    // map方法表示将mongoose中的数据类型先转为字符串再判断是否存在
    if (!me.collectingAnswers.map((id) => id.toString()).includes(answerId)) {
      me.collectingAnswers.push(answerId)
      me.save()
      ctx.body = returnCtxBody('成功')
    }
    await next()
  }

  /**
   * 取消收藏答案
   * @param {*} ctx
   */
  async unCollectAnswer(ctx) {
    const answerId = ctx.request.body.answerId
    const me = await User.findById(ctx.state.user._id).select(
      '+collectingAnswers'
    )
    const index = me.collectingAnswers
      .map((id) => id.toString())
      .indexOf(answerId)
    if (index > -1) {
      me.collectingAnswers.splice(index, 1)
      me.save()
    }
    ctx.body = returnCtxBody('成功')
  }

  /**
   * 用户关注的问题列表
   * @param {*} ctx
   */
  async focusQuestionList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.userId)
      .select('+question')
      .populate('question')
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = returnCtxBody('查询成功', user.question)
  }

  /**
   * 关注问题
   * @param {*} ctx
   */
  async focusQuestion(ctx) {
    ctx.verifyParams({
      questionId: { type: 'string', required: true },
    })
    const me = await User.findById(ctx.state.user._id).select('+question')
    if (
      !me.question
        .map((id) => id.toString())
        .includes(ctx.request.body.questionId)
    ) {
      me.question.push(ctx.request.body.questionId)
      me.save()
      ctx.body = returnCtxBody('关注成功')
    } else {
      ctx.throw(405, '您已经关注过了')
    }
  }

  /**
   * 取消关注问题
   * @param {*} ctx
   */
  async unFocusQuestion(ctx) {
    ctx.verifyParams({
      questionId: { type: 'string', required: true },
    })
    const me = await User.findById(ctx.state.user._id).select('+question')
    const index = me.question
      .map((id) => id.toString())
      .indexOf(ctx.request.body.questionId)
    if (index > -1) {
      me.question.splice(index, 1)
      me.save()
    }
    ctx.body = returnCtxBody('取消关注成功')
  }

  /**
   * 获取用户的专栏列表
   * @param {*} ctx
   */
  async columnsList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const columns = await Column.find({
      columnUser: ctx.request.body.userId,
    })
    ctx.body = returnCtxBody('获取成功', columns)
  }

  /**
   * 获取用户的文章列表
   * @param {*} ctx
   */
  async articlesList(ctx) {
    ctx.verifyParams({
      userId: { type: 'string', required: true },
    })
    const articles = await Article.find({
      articleUser: ctx.request.body.userId,
    })
    ctx.body = returnCtxBody('获取成功', articles)
  }
}

module.exports = new UsersController()
