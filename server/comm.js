//----------------------------------------------------------------------------------------------------------------------
// Communication module.
//
// @module comm.js
//----------------------------------------------------------------------------------------------------------------------

var async = require('async');

var coverart = require('./utils/coverart');

var app = require('omega-wf').app;
var logger = require('omega-wf').logging.getLogger('comm');

//----------------------------------------------------------------------------------------------------------------------

var currentSong = -1;
var requestedSongs = [];
var songList = [];
var currentPos = 0;
var simulateTimer = null;
var returnPos = -1;

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
        // We don't already have a returnPos, and we're hitting the result queue, so we need to save our returnPos.
        if(returnPos == -1)
        {
            // Record the next song to resume playing at
            returnPos = currentSong + 1;
        } // end if

        var song = requestedSongs[0];
        removeRequest(0);
        return song;
    } // end if

    var nextSongIdx = currentSong + 1;

    // If we've recorded a returnPos, we set that as the next song to play, and clear the returnPos.
    if(returnPos != -1)
    {
        nextSongIdx = returnPos;
        returnPos = -1;
    } // end if

    // If we've gone off the end of the list, we need to loop around.
    if(nextSongIdx >= songList.length)
    {
        nextSongIdx = 0;
    } // end if

    return songList[nextSongIdx];
} // end getNextSong

function addRequest(filename) {
    requestedSongs.push(getSongByFilename(filename));
    clientChannel.emit('requests', { songs: requestedSongs });
} // end addRequest

function removeRequest(idx)
{
    requestedSongs.splice(idx, 1);
    clientChannel.emit('requests', { songs: requestedSongs });
} // end removeRequest

function stop()
{
    currentPos = 0;
    clearInterval(simulateTimer);
} // end if

function playNext()
{
    var nextSong = getNextSong();

    rpiSocket.emit('play next', { song: nextSong.filename }, function(data)
    {
        currentSong = getSongIndex(nextSong);
        simulateSong(nextSong);
        clientChannel.emit('now playing', { song: nextSong.filename });
    });
} // end playNext

function simulateSong(song)
{
    if(simulateTimer)
    {
        // If we have a current simulation running, we need to stop it before we begin this one.
        stop();
    } // end if

    simulateTimer = setInterval(function()
    {
        currentPos++;
        clientChannel.emit('status', { playing: (getCurrentSong() || {}).filename || "none", position: currentPos });

        if(currentPos >= song.duration)
        {
            stop();
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
        stop();

        songList = [];
        requestedSongs = [];
        rpiSocket = undefined;
        clientChannel.emit('rPi disconnected');

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

        if(songList.length > 0)
        {
            // Play the next song!
            playNext();
        } // end if
    });

    //------------------------------------------------------------------------------------------------------------------
    // rPi Connection setup
    //------------------------------------------------------------------------------------------------------------------

    logger.info('rPi connected.');
    clientChannel.emit('rPi connected');

    // Store our socket connection to the rPi.
    rpiSocket = socket;

    // Ask for a list of songs.
    socket.emit('list songs', function(songs)
    {
        // Store the song list
        songList = songs;

        async.each(songList, function(song, cb)
        {
            coverart.getCoverArt(song.artist, song.title, function(image)
            {
                song.image = image;
                cb();
            })
        }, function()
        {
            // Broadcast the song list to all clients
            clientChannel.emit('song list', { songs: songList });

            // Start playing the playlist
            playNext();
        });
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
            playing: (getCurrentSong() || {}).filename || "none",
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