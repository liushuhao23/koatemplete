/*
 * @Author: liushuhao
 * @Date: 2020-08-15 20:30:43
 * @LastEditTime: 2020-08-16 23:32:27
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
var cors = require('koa2-cors');
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')

const config = require('./config')
const routes = require('./routes')

const userrouter = require('./routes/users')



const port = process.env.PORT || config.port

// error handler
onerror(app)


// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  // .use(require('koa-static')(__dirname + '/public'))
  // .use(views(path.join(__dirname, '/views'), {
  //   options: {settings: {views: path.join(__dirname, 'views')}},
  //   map: {'njk': 'nunjucks'},
  //   extension: 'njk'
  // }))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(cors())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

router.use('/userrouter', userrouter);
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World'
  ctx.state = {
    title: 'Koa2zzzzzz'
  }
  await ctx.render('index', ctx.state)
})

router.get('/admin', async (ctx, next) => {
  ctx.body = 'Hello admin'
  // ctx.state = {
  //   title: 'Koa2zzzzzz'
  // }
  // await ctx.render('index', ctx.state)
})



routes(router)
app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
