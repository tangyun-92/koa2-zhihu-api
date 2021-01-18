/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:03
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-18 22:46:29
 */
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/users')
const { secret } = require('../config')

class UsersController {
  /**
   * 查询用户列表
   * @param {*} ctx
   */
  async find(ctx) {
    const user = await User.find()
    ctx.body = {
      status: 200,
      message: '查询成功！',
      data: user,
    }
  }

  /**
   * 查找指定用户
   * @param {*} ctx
   */
  async findById(ctx) {
    const { fields } = ctx.query
    let user = null
    if (fields) {
      const selectFields = fields
        .split(';')
        .filter((f) => f)
        .map((f) => ` +${f}`)
        .join('')
      user = await User.findById(ctx.params.id).select(selectFields)
    } else {
      user = await User.findById(ctx.params.id)
    }
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = {
      status: 200,
      message: '查询成功！',
      data: user,
    }
  }

  /**
   * 创建用户
   * @param {*} ctx
   */
  async create(ctx) {
    // 参数校验
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) {
      return ctx.throw(409, '用户名已存在！')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = {
      status: 200,
      message: '创建用户成功！',
    }
  }

  /**
   * 授权的中间件
   * @param {*} ctx
   * @param {*} next
   */
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      return ctx.throw(403, '没有权限！')
    }
    await next()
  }

  /**
   * 更新用户信息
   * @param {*} ctx
   */
  async update(ctx) {
    // 参数校验
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = {
      status: 200,
      message: '修改成功！',
    }
  }

  /**
   * 删除指定用户
   * @param {*} ctx
   */
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      return ctx.throw(404, '用户不存在')
    }
    ctx.body = {
      status: 200,
      message: '删除成功！',
    }
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
      status: 200,
      message: '登录成功',
      token,
    }
  }

  /**
   * 获取他关注的人列表
   * @param {*} ctx
   */
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+following')
      .populate('following')
    if (!user) {
      return ctx.throw(404)
    }
    ctx.body = {
      status: 200,
      message: '获取成功！',
      data: user.following,
    }
  }

  /**
   * 获取关注他的人列表
   * @param {*} ctx 
   */
  async listFollower(ctx) {
    const users = await User.find({ following: ctx.params.id })
    if (!users) {
      return ctx.throw(404)
    }
    ctx.body = {
      status: 200,
      message: '获取成功！',
      data: users,
    }
  }

  /**
   * 关注
   * @param {*} ctx
   */
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      // map方法表示将mongoose中的数据类型先转为字符串再判断是否存在
      me.following.push(ctx.params.id)
      me.save()
      ctx.body = {
        status: 200,
        message: '关注成功！',
      }
    } else {
      ctx.body = {
        status: 208,
        message: '您已关注过了',
      }
    }
  }

  /**
   * 取消关注
   * @param {*} ctx
   */
  async unFollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following.map((id) => id.toString()).indexOf(ctx.params.id) // 获取要取消关注人在列表中的索引
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.body = {
      status: 200,
      message: '取消关注成功！',
    }
  }
}

module.exports = new UsersController()
