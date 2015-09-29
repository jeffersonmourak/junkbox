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
    }];
    var argumentManager = require("./core/arguments");
    var ArgumentQuery = argumentManager.arguments(hashtag, acceptable);

    var SpotifyWebApi = require('spotify-web-api-node');

    var Instatracker = require("./core/instagram");

    var instagram = new Instatracker.instaTracker();

    var Tracker = require("./core/tracker").tracker;
    var Server = require("./core/server");
    var server = new Server.server();
    var io = Server.io;
    var tracker = new Tracker();
    var musics = [];

    var spotifyApi = new SpotifyWebApi({
        clientId: '211a53c6f95c42bf9c8284d2a0094ede',
        clientSecret: '7ecaa066578446a9a3c57d2bf76eab82',
        redirectUri: 'http://jeffersonmourak.com'
    });

    server.start(3001);

    if (ArgumentQuery.twitter !== false) {
        tracker.track("#" + ArgumentQuery.twitter);

        tracker.data = function(tweet) {
            console.log("tracking \"#" + ArgumentQuery.twitter);
            var thisMusic = tweet.text.replace(ArgumentQuery.twitter, "");
            var i = 0;
            var added = false;

            spotifyApi.searchTracks(thisMusic)
                .then(function(data) {
                    var thisMusic = data.body.tracks.items[0];
                    for (i in musics) {
                        var music = musics[i];

                        if (thisMusic.name == music.name) {
                            music.votes++;
                            added = true;
                            io.emit("music", music);
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
                            user: tweet.user.profile_image_url,
                            uri: thisMusic.uri
                        };
                        musics.push(music);
                        io.emit("music", music);
                    }


                }, function(err) {
                    console.error(err);
                });

            io.emit("tweet", tweet);
        }
    }

    if (ArgumentQuery.instagram !== false) {
        console.log("tracking \"#" + ArgumentQuery.instagram);
        instagram.track(ArgumentQuery.instagram);
        instagram.onPost = function(post) {
            io.emit("instagram",post);
        };
    }



})();
