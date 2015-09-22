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
        .controller('twitters', function($scope, $interval, $timeout) {

            var socket = io();

            var tweet = [];

            $scope.tweet = false;

            $scope.loadingNext = false;

            socket.on("instagram",function(post){
                
                tweet.push({
                    photo: post.user.profile_picture,
                    username: post.user.username,
                    name: post.user.full_name,
                    background_image: "",
                    background_color: "#fff",
                    cover: "",
                    tweet: post.caption.text,
                    image: post.images.standard_resolution.url,
                    imageSize: "height"
                });
            });

            socket.on('tweet', function(msg) {
                

                var media = msg.entities.media;
                var style = false;

                if (media !== undefined) {
                    if (media[0].sizes.large.w > media[0].sizes.large.h) {
                        style = "width";
                    } else {
                        style = "height";
                    }
                }

                tweet.push({
                    photo: msg.user.profile_image_url.replace("_normal", ""),
                    username: msg.user.screen_name,
                    name: msg.user.name,
                    background_image: msg.user.profile_background_image_url,
                    background_color: "#" + msg.user.profile_background_color,
                    cover: msg.user.profile_banner_url,
                    tweet: msg.text,
                    image: media !== undefined ? media[0].media_url + ":large" : false,
                    imageSize: style
                });
            });
            var i = 0;
            var lastI = 0;
            $interval(function() {

                if (tweet.length > lastI) {
                    $scope.loadingNext = true;
                }
                $timeout(function() {
                    $scope.tweet = tweet[i];
                    $scope.tmpTweet = tweet[i + 1];
                    lastI++;
                    if ((i + 1) < tweet.length) {
                        lastI = i;
                        i++;
                    }
                    $scope.loadingNext = false;
                }, 1000);

            }, 5000);

        });

})();
