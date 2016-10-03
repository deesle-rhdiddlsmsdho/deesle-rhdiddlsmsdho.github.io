'use strict';

const Hoek = require('hoek');
const mongoose = require('mongoose');
const jsonfile = require('jsonfile');
const Doc = require(`${__dirname}/../utils/schema/Doc`)
const User = require(`${__dirname}/../utils/schema/User`)
const setting = require(`${__dirname}/../setting`)

module.exports = {
    // GET /setup/ == 설치 시작 페이지로 이동
    "root": function(request, reply) {
        return reply.view('setup', {
            pagename: "deesle 설치"
        })
    },
    "begin": function(request, reply) {
        let config = { needSetup: false }
        let data = request.params

        var admin = new User({
            username: data.username,
            email: data.email,
            password: data.password,
            admin: true
        });

        config.mongoUrl = data.mongoUrl
        config.frontPage = data.frontPage

        admin.save(function (err) {
            !err || console.error(err)
        });
 
        jsonfile.writeFile(`${__dirname}/../setting`, config, {spaces: 2}, function(err) {
            !err || console.error(err) // 에러가 있는 경우 출력
        })
    }
}