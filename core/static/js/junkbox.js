(function() {
    "use strict";

    angular.module('junkbox', ['ngAnimate'])

    .controller('musics', function($scope,$sce) {


            var socket = io();

            var musics = [];

            $scope.url = "";

            $scope.musics = [];

            socket.on('music', function(msg) {
                var added = false;
                for(var i = 0; i < $scope.musics.length; i++){
                    if(msg.name == $scope.musics[i].name){
                        $scope.musics[i].votes++;
                        added = true;
                        break;
                    }
                }

                if(!added){
                    msg.played = false;
                    msg.uri = $sce.trustAsResourceUrl("http://embed.spotify.com/?uri=" + msg.uri);
                    $scope.musics.push(msg);
                }

                $scope.$apply();

            });
        })
        .controller('dj-twitters', function($scope) {
            $scope.twitters = [];
            var socket = io();
            socket.on('tweet', function(msg) {
                $scope.twitters.push({
                    photo: msg.user.profile_image_url,
                    username: msg.user.screen_name,
                    name: msg.user.name,
                    tweet: msg.text
                });
                $scope.twitters.reverse();
                $scope.$apply();
            });
        })
        .controller('twitters', function($scope, $interval) {

            var socket = io();

            var tweet = [];



            socket.on('tweet', function(msg) {
                console.log(msg);
                tweet.push({
                    photo: msg.user.profile_image_url.replace("_normal", ""),
                    username: msg.user.screen_name,
                    name: msg.user.name,
                    background_image: msg.user.profile_background_image_url,
                    background_color: "#" + msg.user.profile_background_color,
                    cover: msg.user.profile_banner_url,
                    tweet: msg.text,
                    image: msg.entities.media[0].media_url
                });
            });
            var i = 0;
            $interval(function() {
                $scope.tweet = tweet[i];
                $scope.tmpTweet = tweet[i + 1];
                if ((i + 1) < tweet.length) {
                    i++;
                }
            }, 3000);

        });

})();
