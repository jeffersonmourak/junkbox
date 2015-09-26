Instagram = require('instagram-node-lib');

Instagram.set('client_id', '7de1f51b4cfd47b780bbb3ddc2f84374');
Instagram.set('client_secret', '810ef858e5e949fdb14e471414b242ae');
Instagram.set('callback_url', 'http://jeffersonmourak.com');

function instaTracker(){
}

var ignore = [];

function isIn(value, array){
	for(var i in array){
		if(value == array[i]){
			return true;
		}
	}
	return false;
}

instaTracker.prototype = {
	track: function(tag){
		var self = this;
		setInterval(function () {
			Instagram.tags.recent({
			    name: tag,
			    complete: function(data, pagination) {
					for(var i in data){
						if(isIn(data[i].id, ignore) === false){
							self.onPost(data[i]);
							ignore.push(data[i].id);
							console.log(ignore);
						}
					}
				}
			});
		}, 5000);
	},
	onPost: function(post){}
}


module.exports = {
    "instaTracker": instaTracker,
}