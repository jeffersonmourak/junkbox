(function() {

    "use strict";

    var util = require('util'),
        express = require('express'),
        app = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http);

    function analyticsAPI(){
        return "{\"data\": \"none\"}";
    }

    function Server() {
        this.api = {};
        this.api.analytics = analyticsAPI;
    }

    Server.prototype = {
        socket: function() {
        },

        start: function(port) {
            var self = this;
            io.on('connection', function(socket) {
                self.socket(socket);
            });

            app.use('/static', express.static(__dirname + '/static'));

            app.use(function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });

            app.get('/', function(req, res) {
                res.sendFile(__dirname + '/pages/index.html');
            });

            app.get('/dj', function(req, res) {
                res.sendFile(__dirname + '/pages/DJ.html');
            });

            app.get("/api/analytics",function(req, res){
                res.send(self.api.analytics());
            });

            app.get('/api/musics', function(req, res){
                res.send(self.api.musics());
            })

            http.listen(port, function() {
                console.log("server running on http://localhost:" + port);
            });
        }

    }

    GLOBAL["Server"] = Server;
    GLOBAL["io"] = io;

})();

module.exports = {
    "server": Server,
    "io": io
}
