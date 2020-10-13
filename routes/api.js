/*
 * @Author: liushuhao
 * @Date: 2020-08-15 20:30:43
 * @LastEditTime: 2020-10-13 23:09:50
 * @LastEditors: liushuhao
 * @Description: 
 * @FilePath: /test-koa/routes/api.js
 */

let users = require('../controller/user/userlogin.js');
let uploadjs = require('../controller/Upload/Upload.js');
var router = require('koa-router')();

router.post('/userlogin', async function (ctx, next) {
  const user = await new users(ctx.request.body);
  let result = await user.login(ctx.request.body);
  if (result.length > 0) {
    ctx.body = {
      code: 200,
      message: '操作成功',
      success: true
    };
  } else {
    if (result.code === 11000) {
      ctx.body = {
        code: 400,
        message: '用户已经存在',
        success: false
      };
    }
    else {
      ctx.body = {
        code: 400,
        message: '登录失败',
        success: false
      };
    }
  }
})

router.post('/upload', async function (ctx, next) {
  const file = ctx.request.files; // 获取上传文件
  const fileresult = await uploadjs(file);

  if (fileresult.success) {
    ctx.body = {
      code: 200,
      message: '上传成功',
      data: {
        url: fileresult.key,
      },
      success: true
    };
  } else {
    ctx.body = {
      code: 400,
      message: '上传失败',
      success: false
    };
  }
})
module.exports = router.routes();
