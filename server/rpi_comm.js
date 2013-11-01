//----------------------------------------------------------------------------------------------------------------------
// Module for Raspberry Pi communication.
//
// @module rpi_comm.js
//----------------------------------------------------------------------------------------------------------------------

var state = require('./state');
var app = require('omega-wf').app;
var logger = require('omega-wf').logging.getLogger('rpi comm');

var rpiSocket = undefined;
var clientSocket = app.channel('/songctrl');

//----------------------------------------------------------------------------------------------------------------------

app.channel('/rpi').on('connection', function (socket)
{
    // Check to see if we already have an rPi connection
    if(rpiSocket) {
        // We already have an rPi connection.
        socket.disconnect();
        logger.warn("Got an rPi connection when we already have an existing rPi connection.");
        return;
    } // end if

    //------------------------------------------------------------------------------------------------------------------
    // Socket.io handlers
    //------------------------------------------------------------------------------------------------------------------

    socket.on('disconnect', function()
    {
        rpiSocket = undefined;
        logger.info('rPi disconnected.');
    });

    socket.on('song finished', function(data)
    {
        if(!data.song)
        {
            logger.warn('[\'song finished\': No song specified.')
        } // end if

        clientSocket.emit('song finished', { song: data.song });

        // Play the next song!
        state.playNext();
    });

    //------------------------------------------------------------------------------------------------------------------
    // rPi Connection setup
    //------------------------------------------------------------------------------------------------------------------

    logger.info('rPi connected.');

    // Store our socket connection to the rPi.
    rpiSocket = socket;

    // Ask for a list of songs.
    socket.emit('list songs', function(songList)
    {
        logger.info("Got Song List:", logger.dump(songList));

        // Store the song list
        state.songList = songList;

        // Broadcast the song list to all clients
        clientSocket.emit('song list', songList);

        // Start playing the playlist
        state.playNext();
    });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    rpiSocket: rpiSocket
}; // end exports

//----------------------------------------------------------------------------------------------------------------------