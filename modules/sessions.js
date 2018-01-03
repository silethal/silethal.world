module.exports = sessions

var pathMod    = require('path');
var multimatch = require('multimatch');

function sessions(opts) {
    return function(files, metalsmith, done) {
        // collect the session files
        var sessionFiles = [];
        Object.keys(files).forEach(function(path) {
            if (multimatch(path, 'pages/sessions/session*.md').length > 0) {
                var sessionNumber = path.match(/session([0-9]+).md/)[1];
                sessionFiles[sessionNumber] = files[path];
            }
        });

        // set the sessionNumber for each session page
        for (var i = 0; i < sessionFiles.length; ++i) {
            sessionFiles[i].sessionNumber = i;
        }

        // add each file to the sessions collection
        for (var i = 0; i < sessionFiles.length; ++i) {
            sessionFiles[i].collection = 'sessions';
        }

        // set page titles
        for (var i = 0; i < sessionFiles.length; ++i) {
            sessionFiles[i].title = 'Session ' + i;
        }

        // set time zone if available
        for (var i = 0; i < sessionFiles.length; ++i) {
            sessionFiles[i].displayDate = sessionFiles[i].date;
            if (sessionFiles[i].timeZone) {
                sessionFiles[i].date += ' ' + sessionFiles[i].timeZone;
            } else {
                sessionFiles[i].date += ' PST';
            }
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
