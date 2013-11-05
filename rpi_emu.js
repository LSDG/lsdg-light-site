//----------------------------------------------------------------------------------------------------------------------
// An "emulator" for the Raspberry Pi's python client. This should mimic the behavior of the rPi for the purposed of
// sending events, responding to commands, and the like.
//----------------------------------------------------------------------------------------------------------------------

var io = require('socket.io-client');
var logger = require('omega-logger').getLogger('rpi emu');

//----------------------------------------------------------------------------------------------------------------------

var playing = undefined;
var nextSong = undefined;
var nowPlayingCB = undefined;
var stopping = false;

var songList = [
    {
        title: "The Night Santa Went Crazy",
        artist: "\"Weird Al\" Yankovic",
        duration: 24,
        filename: "Weird Al - The Night Santa Went Crazy.mp3"
    },
    {
        title: "Jingle Bell Rock",
        artist: "Bobby Helms",
        duration: 12,
        filename: "jbr.aac"
    },
    {
        title: "Winter Wizard (Instrumental)",
        artist: "Trans-Siberian Orchestra",
        duration: 18,
        filename: "TSO - Winter Wizard.mp3"
    },
    {
        title: "Carols Bells (Original Mix)",
        artist: "S.M.E.R.T.",
        duration: 36,
        filename: "cotb.ogg"
    },
    {
        title: "White Christmas",
        artist: "Bing Crosby",
        duration: 18,
        filename: "white_christmas.ogg"
    },
    {
        title: "Oh Come All Ye Faithful",
        artist: "Jeremy Camp",
        duration: 19,
        filename: "track1.wav.mp4"
    }
];

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

function playSong(song)
{
    if(!song)
    {
        logger.critical('playSong called without a song!');
        return;
    } // end if

    playing = song;

    // Call the now playing callback
    (nowPlayingCB || function(){})({ confirm: true });

    // Simulate playing the song
    setTimeout(function()
    {
        rpi.emit('song finished', { song: playing });
        playing = undefined;

        // We were requested to stop once we finished
        if(stopping)
        {
            stopping = false;
            return;
        } // end if

        if(nextSong)
        {
            var nSong = nextSong;
            nextSong = undefined;

            setImmediate(function()
            {
                playSong(getSongByFilename(nSong));
            });
        } // end if

    }, song.duration * 1000);
} // end playSong

//----------------------------------------------------------------------------------------------------------------------

logger.info('rPi EMU v0.0.1 Started.');

var rpi = io.connect('http://localhost:8080/rpi');

rpi.on('error', function(error)
{
    logger.error('shit:', error);
});

rpi.on('connect', function() {
    logger.debug('Connected!');
});

rpi.on('disconnect', function()
{
    logger.critical('Disconnected, exiting!');
    process.kill();
});

rpi.on('get status', function(cb)
{
    cb({ playing: playing || "none" });
});

rpi.on('list songs', function(cb)
{
    cb(songList);
});

rpi.on('play next', function(data, cb)
{
    if(!data.song)
    {
        logger.warn('Missing \'song\' parameter. Ignoring.')
        return;
    } // end if

    var song = getSongByFilename(data.song);

    // Store the CB, and only call it once we've finished playing the current song.
    nowPlayingCB = cb;

    if(!playing)
    {
        playSong(song);
    }
    else
    {
        nextSong = song;
    } // end if
});

rpi.on('stop', function(cb)
{
    stopping = true;
});

rpi.on('stop immediately', function(cb)
{
    logger.warn('\'stop immediately\': unsupported in emulator.');
});

//----------------------------------------------------------------------------------------------------------------------
