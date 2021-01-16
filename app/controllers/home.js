/*
 * @Author: 唐云 
 * @Date: 2021-01-16 23:26:34 
 * @Last Modified by:   唐云 
 * @Last Modified time: 2021-01-16 23:26:34 
 */
class HomeController {
  index(ctx) {
    ctx.body = '这是主页'
  }
}

module.exports = new HomeController()