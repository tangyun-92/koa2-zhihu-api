/*
 * @Author: 唐云 
 * @Date: 2021-01-21 16:43:46 
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 18:59:38
 * 评论
 */
const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/comments' })
const {
  getCommentList,
  getCommentInfo,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/comments')
const { secret } = require('../config')

const auth = jwt({ secret })

router.post('/getCommentList', getCommentList)
router.post('/getCommentInfo', getCommentInfo)
router.post('/createComment', auth, createComment)
router.post('/updateComment', auth, updateComment)
router.post('/deleteComment', auth, deleteComment)

module.exports = router
