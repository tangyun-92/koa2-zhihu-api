/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:52
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 22:01:17
 */
const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')

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
 * 使用koa-jwt实现验证token
 */
const auth = jwt({ secret })

router.get('/', find)

router.post('/', create)

router.get('/:id', findById)

router.patch('/:id', auth, checkOwner, update)

router.delete('/:id', auth, checkOwner, del)

router.post('/login', login)

module.exports = router
