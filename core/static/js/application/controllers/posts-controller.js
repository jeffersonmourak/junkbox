(function() {
    "use strict";
    angular.module('junkbox', [])
        .controller('twitters', function($scope, $sce, $interval, $timeout) {

            var posts = [];

            function addPost(option) {
                posts.push({
                    photo: option.photo,
                    username: option.username,
                    name: option.name,
                    text: option.text,
                    image: option.image,
                    size: option.size,
                    videoID: option.videoID
                });
            }


            var socket = io();
            $scope.post = false;
            $scope.loading = true;

            $scope.advise = {
                image: "http://ateliebar.com:3001/static/bg.png",
                size: "height"
            }

            socket.on("instagram", function(post) {
                console.log(post);
                addPost({
                    photo: post.user.profile_picture,
                    username: post.user.username,
                    name: post.user.full_name,
                    text: post.caption.text,
                    image: post.images.standard_resolution.url,
                    size: "height",
                    videoID: post.videoID !== undefined ? $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + post.videoID + "?autoplay=1") : false
                });
            });

            socket.on('tweet', function(msg) {
                var media = msg.entities.media;
                console.log(msg);
                var style = "";
                if (media !== undefined) {
                    style = media[0].sizes.large.w > media[0].sizes.large.h ? "width" : "height";
                }
                addPost({
                    photo: msg.user.profile_image_url.replace("_normal", ""),
                    username: msg.user.screen_name,
                    name: msg.user.name,
                    text: msg.text,
                    image: media !== undefined ? media[0].media_url + ":large" : false,
                    size: style,
                    videoID: msg.videoID !== undefined ? $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + msg.videoID + "?autoplay=1") : false

                });
            });
            var i = 0;
            $timeout(function(){
                if ((i + 1) <= posts.length) {
                    $scope.loading = true;
                    $scope.post = posts[i];
                    $interval(function() {
                        $scope.loading = false;
                    }, 20);

                    i++;
                }
            },5000);
            $interval(function() {
                if ((i + 1) <= posts.length) {
                    $scope.loading = true;
                    $scope.post = posts[i];
                    $interval(function() {
                        $scope.loading = false;
                    }, 20);

                    i++;
                }
                else{
                    i = 0;
                }

            }, 2000);

        });

})()
