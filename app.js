/*
 * @Author: liushuhao
 * @Date: 2020-08-15 20:30:43
 * @LastEditTime: 2020-10-12 17:24:33
 * @LastEditors: liushuhao
 * @Description: 
 * @FilePath: /test-koa/app.js
 */
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const cors = require('koa2-cors');
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')

const config = require('./config')
const routes = require('./routes')

const userrouter = require('./routes/users');
const apirouter = require('./routes/api.js');
const koaBody = require('koa-body');

const port = process.env.PORT || config.port

// error handler
onerror(app)

app.use(cors())
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}))
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

router.use('/userrouter', userrouter);
router.use('/api', apirouter);

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World'
  ctx.state = {
    title: 'Koa2zzzzzz'
  }
  await ctx.render('index', ctx.state)
})

router.get('/admin', async (ctx, next) => {
  ctx.body = 'Hello admin'
})

routes(router)
app.on('error', function (err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
