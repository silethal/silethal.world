module.exports = flatten

var pathMod    = require('path');
var multimatch = require('multimatch');

function flatten(opts) {
    return function(files, metalsmith, done) {
        Object.keys(files).forEach(function(path) {
            // move the file under opts.destination if it matches opts.pattern
            if (multimatch(path, opts.pattern).length > 0) {
                var file = files[path];
                var newPath = pathMod.join(opts.destination, pathMod.basename(path));
                delete files[path];
                files[newPath] = file;
            }
        });
        done();
    };
}
