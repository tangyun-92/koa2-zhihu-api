/*
 * @Author: 唐云 
 * @Date: 2021-01-21 16:43:46 
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 16:44:58
 * 答案
 */
const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/answers' })
const {
  getAnswerList,
  getAnswerInfo,
  createAnswer,
  updateAnswer,
  deleteAnswer
} = require('../controllers/answers')
const { secret } = require('../config')

const auth = jwt({ secret })

router.post('/getAnswerList', getAnswerList)
router.post('/getAnswerInfo', getAnswerInfo)
router.post('/createAnswer', auth, createAnswer)
router.post('/updateAnswer', auth, updateAnswer)
router.post('/deleteAnswer', auth, deleteAnswer)

module.exports = router
