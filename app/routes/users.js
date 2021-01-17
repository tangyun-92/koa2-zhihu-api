/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:52
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 21:53:43
 */
const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')

const router = new Router({ prefix: '/users' })
const db = [{ name: 'lilei' }]
const {
  find,
  findById,
  create,
  update,
  delete: del,
  login,
  checkOwner,
} = require('../controllers/users')
const { secret } = require('../config')

/**
 * 验证token中间件
 * @param {*} ctx 
 * @param {*} next 
 */
const auth = async (ctx, next) => {
  const { authorization = '' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  try {
    const user = jsonwebtoken.verify(token, secret)
    ctx.state.user = user
  } catch (error) {
    ctx.throw(401, error.message)
  }
  await next()
}

router.get('/', find)

router.post('/', create)

router.get('/:id', findById)

router.patch('/:id', auth, checkOwner, update)

router.delete('/:id', auth, checkOwner, del)

router.post('/login', login)

module.exports = router
