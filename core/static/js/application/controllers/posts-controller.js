(function() {
    "use strict";
    angular.module('junkbox', [])
        .controller('twitters', function($scope, $interval, $timeout) {

            var posts = [];

            function addPost(option) {
                posts.push({
                    photo: option.photo,
                    username: option.username,
                    name: option.name,
                    text: option.text,
                    image: option.image,
                    size: option.size
                });
            }


            var socket = io();
            $scope.post = false;
            $scope.loading = true;

            $scope.advise = {
                image: "http://maxcdn.thedesigninspiration.com/wp-content/uploads/2014/06/App-Dashboard-Design-005.jpg",
                size: "width"
            }

            socket.on("instagram", function(post) {
                addPost({
                    photo: post.user.profile_picture,
                    username: post.user.username,
                    name: post.user.full_name,
                    text: post.caption.text,
                    image: post.images.standard_resolution.url,
                    size: "height"
                });
            });

            socket.on('tweet', function(msg) {
                var media = msg.entities.media;

                if (media !== undefined) {
                    style = media[0].sizes.large.w > media[0].sizes.large.h ? "width" : "height";
                }
                addPost({
                    photo: msg.user.profile_image_url.replace("_normal", ""),
                    username: msg.user.screen_name,
                    name: msg.user.name,
                    text: msg.text,
                    image: media !== undefined ? media[0].media_url + ":large" : false,
                    size: style
                });
            });

            var i = 0;
            $interval(function() {
                console.log(posts);
                if ((i + 1) <= posts.length) {
                    console.log("HERE");
                    $scope.loading = true;
                    $scope.post = posts[i];
                    $interval(function() {
                        $scope.loading = false;
                    }, 20);

                    i++;
                }

            }, 10000);

        });

})()
