//----------------------------------------------------------------------------------------------------------------------
// Settings for the lsdg-light-site application.
//
// @module settings.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');
var swig = require('swig');

//----------------------------------------------------------------------------------------------------------------------

// Enables omega-wf debugging helpers. Disable this for production!
DEBUG = true;

// Omega will send email to the following addresses whenever an error occurs.
admins = [
    //["Your Name", "your.name@example.com"]
];

// Server settings
listenAddress = "0.0.0.0";
listenPort = 8080;

// Used for secure sessions. This should be unique per omega-wf application.
secret = "8754c3dade6a37b834461bb9ab4aa78015999e372405a2c8b07a82d6ff440ccd174ee8a4f68be6c43e277199296f80a8";

// Configure swig
swig.init({
    root: './build',
    cache: DEBUG
});

// Connect Middleware
middleware = [
    // Standard connect middleware
    connect.query()
];

//----------------------------------------------------------------------------------------------------------------------
