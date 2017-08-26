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
    var regex = /\[\[[A-Za-z0-9]+\]\]/g;
    var output = contents;
    var matches = output.match(regex);
    if (matches != null) {
        matches.forEach(function(match) {
            var slug = match.substring(2, match.length-2);
            var filename = slug + '.md';
            var title;
            var fileFound = false;
            Object.keys(files).every(function(path) {
                if (multimatch(path, '**/'+filename).length > 0) {
                    title = files[path].title;
                    fileFound = true;
                    return false;
                } else {
                    return true;
                }
            });
            var linkText;
            var href = '/pages/' + slug + '/';
            if (fileFound) {
                linkText = '[' + title + '](' + href + ')';
            } else {
                linkText = '<a href="' + href + '" class="invalid-link">' + slug + '</a>';
            }
            output = output.replace(new RegExp('\\[\\[' + slug + '\\]\\]', 'g'), linkText);
        });
    }
    return output;
}
