(function() {
    "use strict";

    var Similar = require("./core/likely").similar;
    var Tracker = require("./core/tracker").tracker;
    var Server = require("./core/server");
    var server = new Server.server();
    var io = Server.io;
    var tracker = new Tracker();
    var musics = [];

    var toTrack = "#AaronsNewVideo";

    server.start(3000);
    tracker.track(toTrack);

    tracker.data = function(tweet) {
        var thisMusic = tweet.text.replace(toTrack, "");
        var i = 0;
        var added = false;
        for (i in musics) {
            var music = musics[i];
            var similarity = Similar(music.name, thisMusic) * 100;

            if (similarity >= 40) {
                
                music.votes++;
                added = true;
                io.emit("music", music);
                break;
            }
            musics[i] = music;
        }

        if (!added) {
            
            var music = {
                name: thisMusic,
                votes: 1,
                user: tweet.user.profile_image_url
            };
            musics.push(music);
            io.emit("music", music);
        }

        io.emit("tweet", tweet);
    }


})();
