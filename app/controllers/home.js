/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:34
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 15:42:58
 */
const path = require('path')

 class HomeController {
   index(ctx) {
     ctx.body = '这是主页'
   }

   /**
    * 个人中心头像上传
    * @param {*} ctx
    */
   upload(ctx) {
     const file = ctx.request.files.file
     const basename = path.basename(file.path)
     ctx.body = {
       code: 1,
       status: 200,
       message: '上传成功',
       url: `${ctx.origin}/uploads/users/${basename}`,
     }
   }

   /**
    * 个人中心banner图上传
    * @param {*} ctx 
    */
   uploadUserBanner(ctx) {
    const file = ctx.request.files.file
    const basename = path.basename(file.path)
    ctx.body = {
      code: 1,
      status: 200,
      message: '上传成功',
      url: `${ctx.origin}/uploads/${basename}`
    }
   }
 }

module.exports = new HomeController()
