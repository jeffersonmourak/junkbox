(function() {
    "use strict";
    var server = require("./core/admin/proccess_manager.js");
    var util = require('util'),
        express = require('express'),
        app = express(),
        http = require('http').Server(app),
        bodyParser = require("body-parser"),
        io = require('socket.io')(http);

    var port = 3000;
    var started = false;
    var authenticatedUsers = [];

    function isAuth(ip) {
        for (var i in authenticatedUsers) {
            if (authenticatedUsers[i] == ip) {
                return true;
            }
        }
        return false;
    }

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use('/static', express.static(__dirname + '/core/static'));

    app.get('/', function(req, res) {
        var clientIP = req.connection.remoteAddress;
        if (isAuth(clientIP)) {
            res.sendFile(__dirname + '/core/pages/index.html');
        } else {
            res.sendFile(__dirname + '/core/pages/login.html');
        }
    });

    app.post("/", function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (username == "root" && password == "123") {
            authenticatedUsers.push(req.connection.remoteAddress);
            res.redirect("/admin");
        }
    });
    
    app.get('/admin', function(req, res) {
        var clientIP = req.connection.remoteAddress;
        if (isAuth(clientIP)) {
            if (!started) {
                res.sendFile(__dirname + '/core/pages/admin.html');
            } else {
                res.sendFile(__dirname + '/core/pages/admin-stop.html');
            }
        } else {
            res.redirect("/");
        }
    });

    app.post("/admin", function(req, res) {
        var clientIP = req.connection.remoteAddress;
        var hashtag = req.body.hashtag;
        if (isAuth(clientIP)) {
            if (!started) {
                server.start(hashtag);
                started = true;
                res.redirect("/admin");
            } else {
                server.end();
                started = false;
                res.redirect("/admin");
            }
        }
    });


    http.listen(port, function() {
        console.log("server running on http://localhost:" + port);
    });

})()
