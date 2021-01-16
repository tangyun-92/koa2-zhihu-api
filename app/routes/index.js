/*
 * @Author: 唐云 
 * @Date: 2021-01-16 23:26:47 
 * @Last Modified by:   唐云 
 * @Last Modified time: 2021-01-16 23:26:47 
 */
const fs = require('fs')

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') {
      return
    }
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}
