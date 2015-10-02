(function() {
    "use strict";
    angular.module('junkbox', ['ngAnimate'])
        .controller('musics', function($scope, $sce, $http, $interval) {

            var socket = io();
            var musics = [];
            $scope.url = "";
            $scope.musics = [];

            function getMusics() {
                $http.get("http://ateliebar.com:3001/api/musics")
                    .then(function(response) {
                        for (var j in response.data) {
                            var msg = response.data[j];
                            var added = false;
                            for (var i = 0; i < $scope.musics.length; i++) {
                                if (msg.name == $scope.musics[i].name) {
                                    $scope.musics[i].votes = msg.votes;
                                    added = true;
                                    break;
                                }
                            }
                            if (!added) {
                                msg.played = false;
                                msg.uri = $sce.trustAsResourceUrl("http://embed.spotify.com/?uri=" + msg.uri);
                                $scope.musics.push(msg);
                            }
                        }
                    });
            }

            getMusics();

            $interval(function() {
                getMusics();
            }, 5000);

        });
})()
