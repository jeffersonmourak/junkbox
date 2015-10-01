var mkdirp = require('mkdirp'),
    fs = require('fs'),
    request = require('request');

var download = function(uri,path, index, callback) {

    if (!fs.existsSync(path)) {
        mkdirp(path, function(err) {
            if (err) {
                throw "ERROR";
            }
        });
    }

    request.head(uri, function(err, res, body) {
        var ext = res.headers['content-type'].split("/")[1];
        request(uri).pipe(fs.createWriteStream(path +"/"+ index + "." + ext)).on('close', callback);
    });
};

module.exports = {
	download: download
}