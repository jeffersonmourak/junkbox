var YouTube = require('youtube-node');

var youTube = new YouTube();

youTube.setKey('AIzaSyBrzACVQqvXp7JWccVZZ47zLB37RK6AZXk');

function find(name,callback) {
    youTube.search(name, 2, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            if (result.items.length > 0) {
                callback(result.items[0].id.videoId);
            } else {
                callback("NOVIDEO");
            }
        }
    });
}

module.exports = {
	find: find
}