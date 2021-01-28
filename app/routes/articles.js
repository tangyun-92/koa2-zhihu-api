/*
 * @Author: 唐云
 * @Date: 2021-01-20 17:15:55
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-28 16:50:27
 * 文章
 */
const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/articles' })
const {
  getArticleList,
  getArticleInfo,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articles')
const { secret } = require('../config')

const auth = jwt({ secret })

router.post('/getArticleList', getArticleList)
router.post('/getArticleInfo', getArticleInfo)
router.post('/createArticle', auth, createArticle)
router.post('/updateArticle', auth, updateArticle)
router.post('/deleteArticle', auth, deleteArticle)

module.exports = router
