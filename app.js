/*
 * @Author: liushuhao
 * @Date: 2020-08-15 20:30:43
 * @LastEditTime: 2021-05-26 17:15:04
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
const JwtUtil = require('./common/jwt.js')


const userrouter = require('./routes/users');
const apirouter = require('./routes/api.js');
const articlesprRuter = require('./routes/articles.js')
const koaBody = require('koa-body');
const IO = require( 'koa-socket' )


const port = process.env.PORT || config.port
const io = new IO();

// error handler
onerror(app)

app.use(cors())
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}))
app.use(async (ctx, next) => {
  console.log(ctx, 'ctx');
  if (ctx.request.method === 'GET') {
    await next();
  } else {
  // 我这里登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
    if (ctx.url != '/api/userlogin' && ctx.url != '/api/register' && ctx.url != '/api/jsonp') {
        let token = ctx.request.header['x-access-token'];
        let jwt = new JwtUtil(token);
        let result = jwt.verifyToken();
        if (result == 'err') {
            console.log(result);
            ctx.body = {
              code: 403,
              message: '登录已过期,请重新登录',
              success: false
            };
        } else {
          await next();
        }
    } else {
      await next()
    }
  }
});
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

io.attach( app )

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

router.use('/userrouter', userrouter);
router.use('/api', apirouter);
router.use('/api/articles', articlesprRuter);


router.get('/', async (ctx) => {
  ctx.body = 'Hello World'
  ctx.state = {
    title: 'Koa2zzzzzz'
  }
  await ctx.render('index', ctx.state)
})

router.get('/admin', async (ctx) => {
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
