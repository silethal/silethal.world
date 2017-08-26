var Runner = require('metalsmith-start').Runner;
var ms = require('./index.js');
ms.clean(false); // cleaning during continous build on Windows can cause problems

var r = new Runner(ms);
r.start(function(){});
