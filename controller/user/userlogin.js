/*
 * @Author: liushuhao
 * @Date: 2020-08-19 10:11:09
 * @LastEditTime: 2020-10-12 17:27:32
 * @LastEditors: liushuhao
 * @Description: 
 * @FilePath: /test-koa/controller/user/userlogin.js
 */

const db = require('../../config/db/db.js');

class users {
    constructor(data) {
        this.userinfo =data;
        this.init();
    }
    init() {
        const userparams = {
            'username': String,
            'phone': Number,
            'userimg': String,
            'sex': String,
            'name': String
        }
        db.init('user', userparams);
    }
    async login(data) {
        console.log(data, 'data');
        let result = await db.findOne(data);
        let datas = [];
        console.log(result, 'resultsss');
        if (result) {
            datas.push(result);
        }
        return datas;
    }
}

module.exports = users;