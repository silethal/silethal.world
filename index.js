var Metalsmith        = require('metalsmith');
var writemetadata     = require('metalsmith-writemetadata');

var markdown          = require('metalsmith-markdown');
var layouts           = require('metalsmith-layouts');
var permalinks        = require('metalsmith-permalinks');
var pageData          = require('metalsmith-page-data');
var search            = require('metalsmith-simple-search');

var collections       = require('metalsmith-collections');
var feed              = require('metalsmith-feed');
var excerpts          = require('metalsmith-better-excerpts');

var handlebars        = require('handlebars');
var handlebarsLayouts = require('handlebars-layouts');

var path              = require('path');

var flatten           = require('./modules/flatten.js');
var link              = require('./modules/link.js');
var sessions          = require('./modules/sessions.js');

// handlebars config
handlebars.registerHelper(handlebarsLayouts(handlebars));

var ms = Metalsmith(__dirname)
    .metadata({
        site: {
            title: 'silethal.world',
            description: 'Informational site for the world Silethal in a Dungeon World campaign',
            url: 'https://www.silethal.world'
        },
        generator: 'Metalsmith',
        generatorUrl: 'http://www.metalsmith.io/'
    })
    .use(sessions())
    .use(pageData([
        {
            pattern: 'pages/**/*.md',
            data: {
                layout: 'page.html'
            }
        }
    ]))
    .use(pageData([
        {
            pattern: 'pages/sessions/*.md',
            data: {
                layout: 'session.html'
            },
            override: true
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
    .use(collections({
        sessions: {
            sortBy: 'sessionNumber',
            reverse: true
        }
    }))
    .use(excerpts({
        stripTags: false
    }))
    .use(feed({
        collection: 'sessions',
        limit: false
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
