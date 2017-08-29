module.exports = sessions

var pathMod    = require('path');
var multimatch = require('multimatch');

function sessions(opts) {
    return function(files, metalsmith, done) {
        var sessionFiles = [];
        Object.keys(files).forEach(function(path) {
            if (multimatch(path, 'pages/sessions/session*.md').length > 0) {
                var sessionNumber = path.match(/session([0-9]+).md/)[1];
                sessionFiles[sessionNumber] = files[path];
            }
        });
        for (var i = 0; i < sessionFiles.length; ++i) {
            if (i > 0) {
                sessionFiles[i].previous = i-1;
            }
            if (i < sessionFiles.length-1) {
                sessionFiles[i].next = i+1;
            }
        }
        done();
    };
}
