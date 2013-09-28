var http = require('http');
var express = require('express');
var socketio = require('socket.io')
var url = require('url');
var querystring = require('querystring');

function days(n) {
    return 1000*3600*24*n;
}

var app = express()
    .use(express.compress())
    .use(express.static(__dirname + '/public', { maxAge: days(0)}))
    .use(express.static(__dirname + '/bower_components'))
    // .use(express.static(__dirname + '/bower_components', { maxAge: days(0)}))
    .get('/set?:args', setHandler);

var server = http.createServer(app);
var io = socketio.listen(server);

var socketMap = {};
var cache;

function publishAll(data) {
    cache = data;
    for (var id in socketMap) {
        socketMap[id].emit('quotes', data);
    }
}

function setHandler(req, res)
{
    var urlParts = url.parse(req.url)
    var quotes = querystring.parse(urlParts.query);
    publishAll(quotes);
    res.json(quotes);
}

server.listen(5080);

io.sockets.on('connection', function (socket) {
    socketMap[socket.id] = socket;

    console.log('cache: ' + cache);

    if (cache) {
        socket.emit('quotes', cache);
    }

    socket.on('disconnect', function () {
        delete socketMap[socket.id]
    });
});
