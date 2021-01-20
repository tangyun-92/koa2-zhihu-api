/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:03
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 15:40:15
 */
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/users')
const { secret } = require('../config')
const { returnCtxBody } = require('../utils')

class UsersController {
  /**
   * 查询用户列表
   * @param {*} ctx
   */
  async getUserList(ctx) {
    let { limit = 10, page } = ctx.request.body
    page = Math.max(page * 1, 1) - 1
    limit = Math.max(limit * 1, 1)
    const users = await User.find()
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
      id: { type: 'string', required: true },
    })
    const id = ctx.request.body.id
    const user = await User.findById(id).select(
      '+educations +locations +business +employments'
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
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      banner_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    })
    const user = await User.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body
    )
    const dbUser = await User.findById(ctx.request.body.id).select(
      '+educations +locations +business +employments'
    )
    ctx.body = returnCtxBody('更新成功', dbUser)
  }

  /**
   * 删除指定用户
   * @param {*} ctx
   */
  async deleteUser(ctx) {
    const user = await User.findByIdAndRemove(ctx.request.body.id)
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
      id: { type: 'string', required: true },
    })
    const user = await User.findById(ctx.request.body.id)
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
      id: { type: 'string', required: true },
    })
    const users = await User.find({ following: ctx.request.body.id })
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
    const me = await User.findById(ctx.state.user._id).select('+following')
    // map方法表示将mongoose中的数据类型先转为字符串再判断是否存在
    if (
      !me.following.map((id) => id.toString()).includes(ctx.request.body.id)
    ) {
      me.following.push(ctx.request.body.id)
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
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following
      .map((id) => id.toString())
      .indexOf(ctx.request.body.id) // 获取要取消关注人在列表中的索引
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.body = returnCtxBody('取消关注成功')
  }
}

module.exports = new UsersController()
