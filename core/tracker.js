(function() {
    "use strict";

    var Twitter = require('twitter');

    function Tracker() {
    	this.consumer_key = "sT5UMONMgeUkmyePT6dige9Rc";
    	this.consumer_secret = "IJhIq8NhJp53OR2o2BTLRRKrHJGMtGCuxf326jB2JFlmxlsGs7";
    	this.access_token_key = "237497963-yTBPbBj989Cu91BDfnZC84RUn407zIB4plXAOSBc";
    	this.access_token_secret = "iEALxxjk5Ay3fHvX2sOP2oKLsojxJA7mYJ8TCVZYIjXNS";

        this.client = null;
    }

    Tracker.prototype = {
       data: function(tweet){},
        track: function(toTrack) {
            var self = this;
            this.client = new Twitter({
                consumer_key: this.consumer_key,
                consumer_secret: this.consumer_secret,
                access_token_key: this.access_token_key,
                access_token_secret: this.access_token_secret
            });

            this.client.stream('statuses/filter', {
                track: toTrack
            }, function(stream) {
                stream.on('data', function(tweet) {
                    self.data(tweet);
                });
                stream.on('error', function(error) {
                    console.log(error);
                });
            });
        }
    }

    GLOBAL["Tracker"] = Tracker;

})();

module.exports = {
    "tracker": Tracker,
}