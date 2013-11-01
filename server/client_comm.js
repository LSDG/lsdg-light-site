//----------------------------------------------------------------------------------------------------------------------
// Module for client communication.
//
// @module client_comm.js
//----------------------------------------------------------------------------------------------------------------------

var app = require('omega-wf').app;
var logger = require('omega-wf').logging.getLogger('rpi comm');

var state = require('./state');

//----------------------------------------------------------------------------------------------------------------------

app.channel('/songctrl').on('connection', function (socket)
{
    socket.on('get status', function(cb)
    {
        cb({ playing: state.getStatus() });
    });

    socket.on('list songs', function(cb)
    {
        cb({ songs: state.songList });
    });

    socket.on('list requested songs', function(cb)
    {
        cb({ songs: state.requestedSongs });
    });

    socket.on('request song', function(data, cb)
    {
        if(!data.song)
        {
            logger.warn('Missing \'song\' parameter. Ignoring.');
            return;
        } // end if

        cb(state.addRequest(data.song));
    });

    socket.on('remove request', function(data, cb)
    {
        if(!data.song)
        {
            logger.warn('Missing \'song\' parameter. Ignoring.');
            return;
        } // end if

        cb(state.removeRequest(data.song));
    })
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
}; // end exports

//----------------------------------------------------------------------------------------------------------------------