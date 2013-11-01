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
        duration: 243,
        image: {
            small: 'http://ecx.images-amazon.com/images/I/51ZJjk4vPEL._AA160_.jpg',
            medium: 'http://ecx.images-amazon.com/images/I/51ZJjk4vPEL._AA160_.jpg',
            large: 'http://ecx.images-amazon.com/images/I/51ZJjk4vPEL._AA160_.jpg'
        },
        filename: "Weird Al - The Night Santa Went Crazy.mp3"
    },
    {
        title: "Jingle Bell Rock",
        artist: "Bobby Helms",
        currentTime: 98,
        duration: 120,
        image: {
            small: 'http://ecx.images-amazon.com/images/I/51s4JEPj15L._AA160_.jpg',
            medium: 'http://ecx.images-amazon.com/images/I/51s4JEPj15L._AA160_.jpg',
            large: 'http://ecx.images-amazon.com/images/I/51s4JEPj15L._AA160_.jpg'
        },
        filename: "jbr.aac"
    },
    {
        title: "Winter Wizard (Instrumental)",
        artist: "Trans-Siberian Orchestra",
        duration: 185,
        image: {
            small: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
            medium: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
            large: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg'
        },
        filename: "TSO - Winter Wizard.mp3"
    },
    {
        title: "White Christmas",
        artist: "Bing Crosby",
        duration: 183,
        image: {
            small: 'http://ecx.images-amazon.com/images/I/51W6mPwureL._AA110_.jpg',
            medium: 'http://ecx.images-amazon.com/images/I/51W6mPwureL._AA110_.jpg',
            large: 'http://ecx.images-amazon.com/images/I/51W6mPwureL._AA110_.jpg'
        },
        filename: "white_christmas.ogg"
    },
    {
        title: "Oh Come All Ye Faithful",
        artist: "Jeremy Camp",
        duration: 198,
        image: {
            small: 'http://ecx.images-amazon.com/images/I/51GajV6Vj1L._SL500_AA280_.jpg',
            medium: 'http://ecx.images-amazon.com/images/I/51GajV6Vj1L._SL500_AA280_.jpg',
            large: 'http://ecx.images-amazon.com/images/I/51GajV6Vj1L._SL500_AA280_.jpg'
        },
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

rpi.on('connect', function () {
    logger.debug('Connected!');
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
    console.log('play next!');

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
