/*
 * @Author: liushuhao
 * @Date: 2020-08-16 14:26:16
 * @LastEditTime: 2020-08-16 15:06:27
 * @LastEditors: liushuhao
 * @Description: 
 * @FilePath: /test-koa/config/mongo.js
 */
const mongoose = require('mongoose').set('debug', true);

// const url = 'mongodb://username:password@localhost:27017/dbname'
const url = 'mongodb://127.0.0.1:27017/test'


module.exports = {
    connect: ()=> {            
        mongoose.connect(url,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        let db = mongoose.connection
        db.on('error', console.error.bind(console, '连接错误:'));
        db.once('open', ()=> {
            console.log('mongodb connect suucess');
        })
    }
}