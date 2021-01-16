/*
 * @Author: 唐云 
 * @Date: 2021-01-16 23:26:52 
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 00:44:11
 */
const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const db = [{ name: 'lilei' }]
const {
  find,
  findById,
  create,
  update,
  delete: del,
} = require('../controllers/users')

router.get('/', find)

router.post('/', create)

router.get('/:id', findById)

router.patch('/:id', update)

router.delete('/:id', del)

module.exports = router
