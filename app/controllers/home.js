/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:34
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 22:35:59
 */
const path = require('path')

 class HomeController {
  index(ctx) {
    ctx.body = '这是主页'
  }

  upload(ctx) {
    const file = ctx.request.files.file
    const basename = path.basename(file.path)
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`
    }
  }
}

module.exports = new HomeController()
