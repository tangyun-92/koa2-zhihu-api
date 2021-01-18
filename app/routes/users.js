/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:52
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-18 22:54:52
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
  listFollowing,
  listFollower,
  checkUserExist,
  follow,
  unFollow
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

router.get('/:id/following', listFollowing)

router.get('/:id/followers', listFollower)

router.put('/following/:id', auth, checkUserExist, follow)

router.delete('/unFollowing/:id', auth, checkUserExist, unFollow)

module.exports = router
