(function() {
    "use strict";

    var hashtag = process.argv.slice(2);
    var acceptable = [{
        "name": "twitter",
        "shortcut": "t",
        "requestValue": true
    }, {
        "name": "instagram",
        "shortcut": "i",
        "requestValue": true,
    }, {
        "name": "save",
        "shortcut": "s",
        "requestValue": false,
    }, {
        "name": "spotify",
        "shortcut": "p",
        "requestValue": false,
    }, {
        "name": "youtube",
        "shortcut": "y",
        "requestValue": false,
    }];
    var argumentManager = require("./core/arguments");
    var ArgumentQuery = argumentManager.arguments(hashtag, acceptable);

    var SpotifyWebApi = require('spotify-web-api-node');

    var Instatracker = require("./core/instagram");
    var youtube = require("./core/youtube");

    var imageBox = require("./core/imageBox.js");

    var instagram = new Instatracker.instaTracker();

    var Tracker = require("./core/tracker").tracker;
    var Server = require("./core/server");
    var server = new Server.server();
    var io = Server.io;
    var tracker = new Tracker();
    var musics = [];

    var analytics = {};

    var spotifyApi = new SpotifyWebApi({
        clientId: '211a53c6f95c42bf9c8284d2a0094ede',
        clientSecret: '7ecaa066578446a9a3c57d2bf76eab82',
        redirectUri: 'http://jeffersonmourak.com'
    });

    server.start(3001, ArgumentQuery.youtube);

    if (ArgumentQuery.youtube) {
        console.log("YouTube Support: Enabled");
    } else {
        console.log("YouTube Support: Disabled");
    }

    if (ArgumentQuery.spotify) {
        console.log("Spotify Support: Enabled");
    } else {
        console.log("Spotify Support: Disabled");
    }

    if (ArgumentQuery.twitter !== false) {
        tracker.track("#" + ArgumentQuery.twitter);

        console.log("tracking \"#" + ArgumentQuery.twitter);

        tracker.data = function(tweet) {
            var thisMusic = tweet.text.replace("#" + ArgumentQuery.twitter, "");
            var i = 0;
            var added = false;

            if (ArgumentQuery.spotify) {
                spotifyApi.searchTracks(thisMusic)
                    .then(function(data) {
                        var thisMusic = data.body.tracks.items[0];
                        for (i in musics) {
                            var music = musics[i];

                            if (thisMusic.name == music.name) {
                                music.votes++;
                                added = true;
                                break;
                            }


                            musics[i] = music;
                        }

                        if (!added) {

                            var music = {
                                name: thisMusic.name,
                                preview: thisMusic.preview_url,
                                album: {
                                    name: thisMusic.album.name,
                                    images: thisMusic.album.images
                                },
                                votes: 1,
                                uri: thisMusic.uri
                            };

                            if (ArgumentQuery.youtube) {
                                youtube.find(thisMusic.name, function(id) {
                                    if (id === "NOVIDEO") {
                                        console.log("No Video for " + thisMusic.name);
                                        return;
                                    }
                                    tweet.videoID = id;
                                    io.emit("tweet", tweet);
                                })
                            }
                            else{
                                io.emit("tweet", tweet);
                            }

                            musics.push(music);
                            
                        }

                    }, function(err) {
                        console.error(err);
                    });
            }
            else{
                io.emit("tweet", tweet);
            }

            if (analytics.twits === undefined) {
                analytics.twits = [];
            }

            if (ArgumentQuery.save && tweet.entities.media !== undefined) {
                imageBox.download(tweet.entities.media[0].media_url + ":large", __dirname + "/core/images/" + ArgumentQuery.twitter, "twitter-" + analytics.twits.length, function() {});
            }

            analytics.twits.push(new Date());
        }
    }

    if (ArgumentQuery.instagram !== false) {
        console.log("tracking \"#" + ArgumentQuery.instagram);
        instagram.track(ArgumentQuery.instagram);
        instagram.onPost = function(post) {
            if (analytics.instagram === undefined) {
                analytics.instagram = [];
            }
            var thisMusic = post.caption.text.replace("#" + ArgumentQuery.instagram, "");
            var added = false;

            if (ArgumentQuery.spotify) {
                spotifyApi.searchTracks(thisMusic)
                    .then(function(data) {
                        var thisMusic = data.body.tracks.items[0];
                        for (i in musics) {
                            var music = musics[i];

                            if (thisMusic.name == music.name) {
                                music.votes++;
                                added = true;
                                break;
                            }


                            musics[i] = music;
                        }

                        if (!added) {

                            var music = {
                                name: thisMusic.name,
                                preview: thisMusic.preview_url,
                                album: {
                                    name: thisMusic.album.name,
                                    images: thisMusic.album.images
                                },
                                votes: 1,
                                uri: thisMusic.uri
                            };
                            if (ArgumentQuery.youtube) {
                                youtube.find(thisMusic.name, function(id) {
                                    if (id === "NOVIDEO") {
                                        console.log("No Video for " + thisMusic.name);
                                        return;
                                    }
                                    post.videoID = id;
                                    io.emit("instagram", post);
                                })
                            }
                            else{
                                io.emit("instagram", post);
                            }
                            musics.push(music);
                            io.emit("youtube",videoID);
                        }



                    }, function(err) {
                        console.error(err);
                    });
            }
            else{
                io.emit("instagram", post);
            }

            if (ArgumentQuery.save) {
                imageBox.download(post.images.standard_resolution.url, __dirname + "/core/images/" + ArgumentQuery.instagram, "instagram-" + analytics.instagram.length, function() {});
            }

            analytics.instagram.push(new Date());

        };
    }

    function getAnalytics() {
        return JSON.stringify(analytics);
    }

    function getMusics() {
        return JSON.stringify(musics);
    }

    server.api.analytics = getAnalytics;
    server.api.musics = getMusics;


})();
