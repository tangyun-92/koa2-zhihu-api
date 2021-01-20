/*
 * @Author: 唐云
 * @Date: 2021-01-20 17:15:55
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 17:18:20
 */
const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/asks' })
const { getAskList, createAsk } = require('../controllers/asks')
const { secret } = require('../config')

const auth = jwt({secret})

router.post('/getAskList', getAskList)

router.post('/createAsk', auth, createAsk)

module.exports = router
