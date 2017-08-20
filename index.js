var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');

Metalsmith(__dirname)
    .metadata({
        title: 'Silenthando',
        description: 'Informational site for a Dungeon World campaign',
        generator: 'Metalsmith',
        url: 'http://www.metalsmith.io/'
    })
    .use(markdown())
    .use(permalinks())
    .use(layouts({
        engine: 'handlebars'
    }))
    .build(function(err, files) {
        if (err) { throw err; }
    });
