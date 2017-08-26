var Runner = require('metalsmith-start').Runner;
var ms = require('./index.js');

var r = new Runner(ms);
r.start(function(){});
