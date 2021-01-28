/*
 * @Author: 唐云
 * @Date: 2021-01-20 17:15:55
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-28 16:22:45
 */
const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/columns' })
const {
  getColumnList,
  createColumn,
  updateColumn,
  deleteColumn,
} = require('../controllers/columns')
const { secret } = require('../config')

const auth = jwt({ secret })

router.post('/getColumnList', getColumnList)
router.post('/createColumn', auth, createColumn)
router.post('/updateColumn', auth, updateColumn)
router.post('/deleteColumn', auth, deleteColumn)

module.exports = router
