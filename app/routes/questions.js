/*
 * @Author: 唐云
 * @Date: 2021-01-20 17:15:55
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 23:08:52
 */
const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/questions' })
const {
  getQuestionList,
  getQuestionInfo,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questions')
const { secret } = require('../config')

const auth = jwt({ secret })

router.post('/getQuestionList', getQuestionList)
router.post('/getQuestionInfo', getQuestionInfo)
router.post('/createQuestion', auth, createQuestion)
router.post('/updateQuestion', auth, updateQuestion)
router.post('/deleteQuestion', auth, deleteQuestion)

module.exports = router
