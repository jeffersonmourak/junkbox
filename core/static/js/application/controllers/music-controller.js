(function() {
    "use strict";
    angular.module('junkbox', ['ngAnimate'])
    .controller('musics', function($scope, $sce) {

        var socket = io();
        var musics = [];
        $scope.url = "";
        $scope.musics = [];
        socket.on('music', function(msg) {
            var added = false;
            for (var i = 0; i < $scope.musics.length; i++) {
                if (msg.name == $scope.musics[i].name) {
                    $scope.musics[i].votes++;
                    added = true;
                    break;
                }
            }
            if (!added) {
                msg.played = false;
                msg.uri = $sce.trustAsResourceUrl("http://embed.spotify.com/?uri=" + msg.uri);
                $scope.musics.push(msg);
            }
            $scope.$apply();
        });
    });
})()
