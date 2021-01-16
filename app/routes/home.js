/*
 * @Author: 唐云 
 * @Date: 2021-01-16 23:26:42 
 * @Last Modified by:   唐云 
 * @Last Modified time: 2021-01-16 23:26:42 
 */
const Router = require('koa-router')
const router = new Router()
const { index } = require('../controllers/home')

router.get('/', index)

module.exports = router
