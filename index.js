var Metalsmith        = require('metalsmith');
var writemetadata     = require('metalsmith-writemetadata');

var markdown          = require('metalsmith-markdown');
var layouts           = require('metalsmith-layouts');
var permalinks        = require('metalsmith-permalinks');
var pageData          = require('metalsmith-page-data');

var handlebars        = require('handlebars');
var handlebarsLayouts = require('handlebars-layouts');

var flatten           = require('./modules/flatten.js');
var link              = require('./modules/link.js');

// handlebars config
handlebars.registerHelper(handlebarsLayouts(handlebars));

Metalsmith(__dirname)
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
    .use(permalinks())
    .use(layouts({
        engine: 'handlebars',
        partials: 'layouts'
    }))
    .build(function(err, files) {
        if (err) { throw err; }
    }
);
