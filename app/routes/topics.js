/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:52
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 22:26:37
 */
const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/topics' })
const {
  getTopicList,
  getTopicInfo,
  createTopic,
  updateTopic,
  topicsListFollowers,
} = require('../controllers/topics')
const { secret } = require('../config')

/**
 * 使用koa-jwt实现验证token
 */
const auth = jwt({ secret })

router.post('/getTopicList', getTopicList)

router.post('/getTopicInfo', getTopicInfo)

router.post('/createTopic', auth, createTopic)

router.post('/updateTopic', auth, updateTopic)

router.post('/topicsListFollowers', topicsListFollowers)

module.exports = router
