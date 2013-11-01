// ---------------------------------------------------------------------------------------------------------------------
// Main lsdg-light-site module.
//
// @module server.js
// ---------------------------------------------------------------------------------------------------------------------

var path = require('path');
var app = require('omega-wf').app;
var views = require('./server/views');

// Communication Modules
require('./server/comm');

// ---------------------------------------------------------------------------------------------------------------------

app.router.add(
    {
        url: '/vendor/*',
        path: path.join(__dirname, 'vendor')
    },
    {
        url: '/*',
        path: path.join(__dirname, 'build')
    },
    {
        url: /^\/(?!admin)/,
        get: views.index
    }
);

// Set the application's name
app.setName('lsdg-light-site');

// Start the omega-wf app.
app.listen();

// ---------------------------------------------------------------------------------------------------------------------
