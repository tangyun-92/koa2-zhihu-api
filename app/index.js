const Koa = require('koa')
const app = new Koa()
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const routing = require('./routes')

// 错误处理
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
)

// 返回ctx.request.body的数据
app.use(bodyparser())
// 校验参数
app.use(parameter(app))
routing(app)

app.listen(3000, () => console.log('程序启动在3000端口'))
