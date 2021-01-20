/*
 * @Author: 唐云 
 * @Date: 2021-01-16 23:26:42 
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 15:37:24
 */
const Router = require('koa-router')
const router = new Router()
const { index, upload, uploadUserBanner } = require('../controllers/home')

router.get('/', index)

router.post('/upload', upload)

router.post('/uploadUserBanner', uploadUserBanner)

module.exports = router
