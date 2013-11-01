//----------------------------------------------------------------------------------------------------------------------
// Communication module.
//
// @module comm.js
//----------------------------------------------------------------------------------------------------------------------

var app = require('omega-wf').app;
var logger = require('omega-wf').logging.getLogger('comm');

//----------------------------------------------------------------------------------------------------------------------

var currentSong = -1;
var requestedSongs = [];
var songList = [];
var currentPos = 0;

var rpiSocket = undefined;
var clientChannel = app.channel('/songctrl');

//----------------------------------------------------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------------------------------------------------

function getSongByFilename(filename)
{
    for(var idx = 0; idx < songList.length; idx++)
    {
        var song = songList[idx];
        if(song.filename == filename)
        {
            return song;
        } // end if
    } // end for

    return undefined;
} // end getSongByFilename

function getSongIndex(song)
{
    for(var idx = 0; idx < songList.length; idx++ )
    {
        var songIdx = songList[idx];
        if(songIdx.filename == song.filename)
        {
            return idx;
        } // end if
    } // end for
} // end getSongByIndex

//----------------------------------------------------------------------------------------------------------------------
// State Handling
//----------------------------------------------------------------------------------------------------------------------

function getCurrentSong()
{
    if(currentSong >= 0)
    {
        return songList[currentSong];
    }
    else
    {
        return undefined;
    } // end if
} // end getCurrentSong

function getNextSong()
{
    if (requestedSongs.length > 0)
    {
        return requestedSongs[0];
    } // end if

    var nextSongIdx = currentSong + 1;
    return songList[nextSongIdx];
} // end getNextSong

function playNext()
{
    var nextSong = getNextSong();

    console.log('play next!');
    rpiSocket.emit('play next', { song: nextSong.filename }, function(data)
    {
        console.log('play next 2!');

        currentSong = getSongIndex(nextSong);
        simulateSong(nextSong);
        clientChannel.emit('now playing', { song: nextSong.filename });
    });
} // end playNext

function addRequest(filename) {
    requestedSongs.push(getSongByFilename(filename));
    clientChannel.emit('requests', { songs: requestedSongs });
} // end addRequest

function removeRequest(idx)
{
    requestedSongs.splice(idx, 1);
    clientChannel.emit('requests', { songs: requestedSongs });
} // end removeRequest

function simulateSong(song)
{
    setTimeout(function()
    {
        currentPos++;
        if(currentPos < song.duration)
        {
            simulateSong(song);
        } // end if
    }, 1000);
} // end simulateSong

//----------------------------------------------------------------------------------------------------------------------
// Raspberry Pi Communication
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

        // Reset our current position in the playing song
        currentPos = 0;

        // Tell our clients that we've finished playing the song
        clientChannel.emit('song finished', { song: data.song });

        // Play the next song!
        playNext();
    });

    //------------------------------------------------------------------------------------------------------------------
    // rPi Connection setup
    //------------------------------------------------------------------------------------------------------------------

    logger.info('rPi connected.');

    // Store our socket connection to the rPi.
    rpiSocket = socket;

    // Ask for a list of songs.
    socket.emit('list songs', function(songs)
    {
        // Store the song list
        songList = songs;

        // Broadcast the song list to all clients
        clientChannel.emit('song list', songList);

        // Start playing the playlist
        playNext();
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Client Communication
//----------------------------------------------------------------------------------------------------------------------

clientChannel.on('connection', function (socket)
{
    logger.info('client connected.');

    socket.on('get status', function(cb)
    {
        cb({
            playing: getCurrentSong().filename || "none",
            position: currentPos
        });
    });

    socket.on('list songs', function(cb)
    {
        cb({ songs: songList });
    });

    socket.on('list requested songs', function(cb)
    {
        cb({ songs: requestedSongs });
    });

    socket.on('request song', function(data)
    {
        if(!data.song)
        {
            logger.warn('Missing \'song\' parameter. Ignoring.');
            return;
        } // end if

        addRequest(data.song);
    });

    socket.on('remove request', function(data)
    {
        if(data.song === undefined)
        {
            logger.warn('Missing \'song\' parameter. Ignoring.');
            return;
        } // end if

        removeRequest(data.song);
    })
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
}; // end exports

//----------------------------------------------------------------------------------------------------------------------