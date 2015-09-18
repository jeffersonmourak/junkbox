(function() {

    "use strict";

    var util = require('util'),
        express = require('express'),
        app = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http);


    function Server() {}

    Server.prototype = {
    	socket: function () {},

        start: function(port) {
        	var self = this;
            io.on('connection', function(socket) {
            	self.socket(socket);
            });

            app.use('/static', express.static(__dirname + '/static'));

            app.get('/', function(req, res) {
                res.sendFile(__dirname + '/pages/index.html');
            });

            app.get('/dj', function(req, res) {
                res.sendFile(__dirname + '/pages/DJ.html');
            });


            http.listen(port, function() {
                console.log("server running on http://localhost:"+port);
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