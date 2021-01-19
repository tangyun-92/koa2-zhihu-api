/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:52
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-19 11:12:43
 */
const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/users' })
const {
  getUserList,
  getUserInfo,
  createUser,
  updateUserInfo,
  deleteUser,
  login,
  interestList,
  fanList,
  follow,
  unFollow,
} = require('../controllers/users')
const { checkOwner, checkUserExist } = require('../middlewares/users')
const { secret } = require('../config')

/**
 * 使用koa-jwt实现验证token
 */
const auth = jwt({ secret })

router.post('/getUserList', getUserList)

router.post('/createUser', createUser)

router.post('/getUserInfo', getUserInfo)

router.post('/updateUserInfo', auth, checkOwner, updateUserInfo)

router.post('/deleteUser', auth, checkOwner, deleteUser)

router.post('/login', login)

router.post('/interestList', interestList)

router.post('/fanList', fanList)

router.post('/follow', auth, checkUserExist, follow)

router.post('/unFollow', auth, checkUserExist, unFollow)

module.exports = router
