var Metalsmith        = require('metalsmith');
var markdown          = require('metalsmith-markdown');
var layouts           = require('metalsmith-layouts');
var permalinks        = require('metalsmith-permalinks');
var pageData          = require('metalsmith-page-data');

var handlebars        = require('handlebars');
var handlebarsLayouts = require('handlebars-layouts');

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
