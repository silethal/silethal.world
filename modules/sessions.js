module.exports = sessions

var pathMod    = require('path');
var multimatch = require('multimatch');

function sessions(opts) {
    return function(files, metalsmith, done) {
        // add next and previous links to session pages
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

        // set page titles
        for (var i = 0; i < sessionFiles.length; ++i) {
            sessionFiles[i].title = 'Session ' + i;
        }

        // add a session list page
        var sessions = [];
        for (var i = 0; i < sessionFiles.length; ++i) {
            sessions[i] = {number: i};
        }
        var sessionListFile = {
            title: 'Sessions',
            layout: 'session-list.html',
            contents: Buffer.from(''),
            sessions: sessions,
        };
        files[pathMod.join('pages', 'session-list.md')] = sessionListFile;

        done();
    };
}
