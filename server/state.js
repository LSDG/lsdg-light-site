//----------------------------------------------------------------------------------------------------------------------
// A node module simply for sharing state/business logic. I could come up with a better name, but meh.
//
// @module state.js
//----------------------------------------------------------------------------------------------------------------------

var logger = require('omega-logger').getLogger('state');
var app = require('omega-wf').app;

//----------------------------------------------------------------------------------------------------------------------

var currentSong = -1;
var requestedSongs = [];
var songList = [];
var clientSocket = app.channel('/songctrl');

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

function playNext()
{
    var nextSong = getNextSong();

    require('./rpi_comm').rpiSocket.emit('play next', { song: nextSong.filename }, function()
    {
        clientSocket.emit('now playing', { song: nextSong.filename });
    });
} // end playNext

function addRequest(filename) {
    requestedSongs.push(getSongByFilename(filename));
} // end addRequest

function removeRequest(idx)
{
    requestedSongs.splice(idx, 1);
} // end removeRequest

function getStatus()
{
    return getCurrentSong() || "none";
} // end getStatus

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    currentSong: currentSong,
    requestedSongs: requestedSongs,
    songList: songList,
    getSongByFilename: getSongByFilename,
    playNext: playNext,
    getStatus: getStatus,
    addRequest: addRequest,
    removeRequest: removeRequest
}; // end exports

//----------------------------------------------------------------------------------------------------------------------