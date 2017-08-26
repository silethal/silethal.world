var Metalsmith        = require('metalsmith');
var writemetadata     = require('metalsmith-writemetadata');

var markdown          = require('metalsmith-markdown');
var layouts           = require('metalsmith-layouts');
var permalinks        = require('metalsmith-permalinks');
var pageData          = require('metalsmith-page-data');
var search            = require('metalsmith-simple-search');

var handlebars        = require('handlebars');
var handlebarsLayouts = require('handlebars-layouts');

var path              = require('path');

var flatten           = require('./modules/flatten.js');
var link              = require('./modules/link.js');

// handlebars config
handlebars.registerHelper(handlebarsLayouts(handlebars));

var ms = Metalsmith(__dirname)
    .metadata({
        title: 'silethal.world',
        description: 'Informational site for the world Silethal in a Dungeon World campaign',
        generator: 'Metalsmith',
        url: 'http://www.metalsmith.io/'
    })
    .use(pageData([
        {
            pattern: 'pages/**/*.md',
            data: {
                layout: 'page.html'
            }
        }
    ]))
    .use(flatten({
        pattern: 'pages/**',
        destination: 'pages'
    }))
    .use(link())
    .use(markdown())
    .use(permalinks({
        relative: false
    }))
    .use(layouts({
        engine: 'handlebars',
        partials: 'layouts'
    }))
    .use(search({
        index: { title: true },
        match: 'pages/**/*.html',
        transformUrl: function(url) {
            return path.basename(path.dirname(url));
        }
    }));

// Run this module directly to build, or export the metalsmith object to
// another script.
if (module.parent) {
    module.exports = ms;
} else {
    ms.build(function (err) { if (err) throw err; });
}
