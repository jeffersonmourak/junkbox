Instagram = require('instagram-node-lib');

Instagram.set('client_id', '7de1f51b4cfd47b780bbb3ddc2f84374');
Instagram.set('client_secret', '810ef858e5e949fdb14e471414b242ae');
Instagram.set('callback_url', 'http://jeffersonmourak.com');

function instaTracker(){
}

var ignore = [];

instaTracker.prototype = {
	track: function(tag){
		var self = this;
		setInterval(function () {
			Instagram.tags.recent({
			    name: tag,
			    complete: function(data, pagination) {
					for(var i in data){
						if((data[i].id in ignore) === false){
							self.onPost(data[i]);
							ignore.push(data[i].id);
						}
					}
				}
			});
		}, 1000);
	},
	onPost: function(post){}
}


module.exports = {
    "instaTracker": instaTracker,
}