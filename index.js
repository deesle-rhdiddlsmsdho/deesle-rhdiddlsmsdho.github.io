'use strict';
// encodeURIComponent() = 한글 버그시 사용

const Hapi = require('hapi');
const Inert = require('inert');
const Hoek = require('hoek');
const mongoose = require('mongoose');
const setting = require(`${__dirname}/setting`)
const util = require(`${__dirname}/utils/util`)

const handlers = {
    wiki: require(`${__dirname}/routes/wiki`)
}

const server = new Hapi.Server();

var db = mongoose.connection;
db.on('error', function(err) {
    console.error(err);
    process.exit(1)
});
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect(setting.mongoUrl);

function mainHandler(err) {
    Hoek.assert(!err, err); // 나름대로 에러 방지
    server.views({
        engines: {
            html: require('pug')
        },
        relativeTo: __dirname,
        path: 'views'
    }); // Pug(Jade) 사용

    server.connection({ port: process.env.PORT || 3000 });
    server.route(util.directoryRoute(`${__dirname}/setting`))
    server.route({ method: 'GET', path: '/', handler: handlers.wiki.root }); // 대문으로 가게 설정
    server.route({
        method: 'GET',
        path: '/{name}',
        handler: function (request, reply) {
            reply('Hello, ' + request.params.name + '!');
        }
    });
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    })
}

server.register(require('vision'), (err) => {
    Hoek.assert(!err, err); // 나름대로 에러 방지   
    server.register(require('inert'), mainHandler);
});