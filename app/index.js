/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:27:03
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 22:33:00
 */
const Koa = require('koa')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
const koaStatic = require('koa-static')

const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')

// 连接数据库
mongoose.connect(
  connectionStr,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('MongoDB连接成功了')
)
mongoose.connection.on('error', console.error)

// 生成图片链接中间件
app.use(koaStatic(path.join(__dirname, 'public')))

// 错误处理
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
)

// 使用koa-body实现文件上传
app.use(
  koaBody({
    multipart: true, // 表示启用文件
    formidable: {
      uploadDir: path.join(__dirname, 'public/uploads'),
      keepExtensions: true,
    },
  })
)
// 校验参数
app.use(parameter(app))
routing(app)

app.listen(3000, () => console.log('程序启动在3000端口'))
