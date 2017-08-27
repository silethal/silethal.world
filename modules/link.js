module.exports = link

var multimatch = require('multimatch');

function link(opts) {
    return function(files, metalsmith, done) {
        Object.keys(files).forEach(function(path) {
            if (multimatch(path, '**/*.md').length > 0) {
                var contents = files[path].contents.toString();
                contents = processLinks(contents, files);
                files[path].contents = Buffer.from(contents);
            }
        });
        done();
    };
}

function processLinks(contents, files) {
    var regex = /\[\[[^\n\[\]]+\]\]/g;
    var output = contents;
    var matches = output.match(regex);
    if (matches != null) {
        matches.forEach(function(match) {
            var tokens = match.substring(2, match.length-2).split('|');
            var slug;
            var display;
            if (tokens.length === 2) {
                slug = tokens[0];
                display = tokens[1];
            } else if (tokens.length === 1) {
                slug = tokens[0];
            } else {
                throw new Error('invalid link syntax: ' + match);
            }

            var filename = slug + '.md';
            var fileFound = false;
            Object.keys(files).every(function(path) {
                if (multimatch(path, '**/'+filename).length > 0) {
                    if (display === undefined) {
                        display = files[path].title;
                    }
                    fileFound = true;
                    return false;
                } else {
                    return true;
                }
            });
            if (display === undefined) {
                display = slug;
            }
            var linkText;
            var href = '/pages/' + slug + '/';
            if (fileFound) {
                linkText = '[' + display + '](' + href + ')';
            } else {
                linkText = '<a href="' + href + '" class="invalid-link">' + display + '</a>';
            }
            output = output.replace(match, linkText);
        });
    }
    return output;
}
