/*
 * @Author: 唐云 
 * @Date: 2021-01-16 23:26:42 
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 22:27:12
 */
const Router = require('koa-router')
const router = new Router()
const { index, upload } = require('../controllers/home')

router.get('/', index)

router.post('/upload', upload)

module.exports = router
