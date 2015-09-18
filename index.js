(function() {
    "use strict";

    var SpotifyWebApi = require('spotify-web-api-node');

    var Similar = require("./core/likely").similar;
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

    var toTrack = "#TESTEIMD";

    server.start(3000);
    tracker.track(toTrack);

    tracker.data = function(tweet) {
        var thisMusic = tweet.text.replace(toTrack, "");
        var i = 0;
        var added = false;

        spotifyApi.searchTracks(thisMusic)
            .then(function(data) {
                console.log("Spotify Returned");
                var thisMusic = data.body.tracks.items[0];
                console.log(thisMusic);
                for (i in musics) {
                    var music = musics[i];

                    if(thisMusic.name == music.name){
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
                        user: tweet.user.profile_image_url
                    };
                    musics.push(music);
                    io.emit("music", music);
                }


            }, function(err) {
                console.error(err);
            });

        io.emit("tweet", tweet);
    }


})();
