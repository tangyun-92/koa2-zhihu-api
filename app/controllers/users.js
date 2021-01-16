/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:03
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 00:53:28
 */
const User = require('../models/users')

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
    const user = await User.findById(ctx.params.id)
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
   * 更新用户信息
   * @param {*} ctx
   */
  async update(ctx) {
    // 参数校验
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
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
}

module.exports = new UsersController()
