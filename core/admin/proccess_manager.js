// http://nodejs.org/api.html#_child_processes
var sys = require('sys');
var psTree = require('ps-tree');
var exec = require('child_process').exec;
var child;
killID = false;
function EndServer() {
    var kill = function(pid, signal, callback) {
        signal = signal || 'SIGKILL';
        callback = callback || function() {};
        var killTree = true;
        if (killTree) {
            psTree(pid, function(err, children) {
                [pid].concat(
                    children.map(function(p) {
                        return p.PID;
                    })
                ).forEach(function(tpid) {
                    try {
                        process.kill(tpid, signal)
                    } catch (ex) {}
                });
                callback();
            });
        } else {
            try {
                process.kill(pid, signal)
            } catch (ex) {}
            callback();
        }
    };
    if( killID !== false){
        kill(killID);
    }
}



function StartServer(track) {
    function puts(error, stdout, stderr) {
        console.log("Server DOWN");
    }
    var child = exec("node index.js -it " + track, puts);
    killID = child.pid;
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
}


module.exports = {
    start: StartServer,
    end: EndServer
}