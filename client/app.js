//----------------------------------------------------------------------------------------------------------------------
// Main lsdg light controller angular application
//
// @module app.js
//----------------------------------------------------------------------------------------------------------------------

window.app = angular.module("lightsite", [
        'ngResource',
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'lightsite.templates',
        'lightsite.controllers'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {templateUrl: '/flatpages/playlist.html', controller: 'PlaylistCtrl as playlist'})
            .otherwise({redirectTo: '/'});
    }])
    .run(['$rootScope', function($rootScope)
    {
        $rootScope.currentSong = 0;
        $rootScope.currentPos = 0;
        $rootScope.requestedSongs = [];
        $rootScope.songList = [];

        //--------------------------------------------------------------------------------------------------------------
        // State Control
        //--------------------------------------------------------------------------------------------------------------

        function getSongByFilename(filename)
        {
            for(var idx = 0; idx < $rootScope.songList.length; idx++)
            {
                var song = $rootScope.songList[idx];
                if(song.filename == filename)
                {
                    return song;
                } // end if
            } // end for

            return undefined;
        } // end getSongByFilename

        function getSongIndex(song)
        {
            if(song)
            {
                for(var idx = 0; idx < $rootScope.songList.length; idx++ )
                {
                    var songIdx = $rootScope.songList[idx];
                    if(songIdx.filename == song.filename)
                    {
                        return idx;
                    } // end if
                } // end for
            }
            else
            {
                console.error("Tried to get index of song, but failed to pass in song!");
            } // end if
        } // end getSongByIndex

        $rootScope.getCurrentSong = function()
        {
            return $rootScope.songList[$rootScope.currentSong];
        }; // end getCurrentSong

        $rootScope.getNextSong = function()
        {
            if ($rootScope.requestedSongs.length > 0)
            {
                return $rootScope.requestedSongs[0];
            } // end if

            var nextSongIdx = $rootScope.currentSong + 1;

            // If we've gone off the end of the list, we need to loop around.
            if(nextSongIdx >= $rootScope.songList.length)
            {
                nextSongIdx = 0;
            } // end if

            return $rootScope.songList[nextSongIdx];
        }; // end getNextSong

        $rootScope.getNextSongByIdx = function()
        {
            return getSongIndex($rootScope.getNextSong());
        }; // end getNextSong


        //--------------------------------------------------------------------------------------------------------------
        // Socket.io communication
        //--------------------------------------------------------------------------------------------------------------

        $rootScope.socket = io.connect("/songctrl");

        $rootScope.socket.on('error', function(error)
        {
            console.log('Socket Error:', error);
        });

        $rootScope.socket.on('song list', function(data)
        {
            $rootScope.$apply(function(){
                $rootScope.songList = data.songs;
            });
        });

        $rootScope.socket.on('requests', function(data)
        {
            $rootScope.$apply(function(){
                $rootScope.requestedSongs = data.songs;
            });
        });

        $rootScope.socket.on('song finished', function(data)
        {
            $rootScope.$apply(function(){
                var next = $rootScope.getNextSongByIdx();
                if(next !== undefined)
                {
                    $rootScope.currentSong = next;
                }
                else
                {
                    //TODO: figure out some sane behavior for this state.
                    console.log('I have no clue what to do here.')
                } // end if
            });
        });

        $rootScope.socket.on('status', function(data)
        {
            console.log('status sent!');
            $rootScope.$apply(function()
            {
                if(data.playing != "none")
                {
                    $rootScope.currentSong = getSongIndex(getSongByFilename(data.playing));
                    $rootScope.currentPos = data.position;
                }
                else
                {
                    $rootScope.currentSong = -1;
                    $rootScope.currentPos = 0;
                } // end if
            });
        });

        //--------------------------------------------------------------------------------------------------------------

        // Get the initial state for the page.
        function getInitialState()
        {
            $rootScope.socket.emit('list songs', function(data)
            {
                $rootScope.$apply(function(){
                    $rootScope.songList = data.songs;
                });

                $rootScope.socket.emit('get status', function(data) {
                    $rootScope.$apply(function()
                    {
                        if(data.playing != "none")
                        {
                            $rootScope.currentSong = getSongIndex(getSongByFilename(data.playing));
                            $rootScope.currentPos = data.position;
                        }
                        else
                        {
                            $rootScope.currentSong = -1;
                            $rootScope.currentPos = 0;
                        } // end if
                    });
                });
            });

            $rootScope.socket.emit('list requested songs', function(data)
            {
                $rootScope.$apply(function(){
                    $rootScope.requestedSongs = data.songs;
                });
            });
        } // end getInitialState

        // Handle rPi connects.
        $rootScope.socket.on('rPi connected', function()
        {
            getInitialState();
        });

        $rootScope.socket.on('rPi disconnected', function()
        {
            $rootScope.$apply(function()
            {
                $rootScope.currentSong = 0;
                $rootScope.currentPos = 0;
                $rootScope.requestedSongs = [];
                $rootScope.songList = [];
            });
        });

        // When we connect, we need to figure out what the current status is, and update ourselves correctly.
        $rootScope.socket.on('connect', function()
        {
            getInitialState();
        });
    }]);

//----------------------------------------------------------------------------------------------------------------------
// Directives
//----------------------------------------------------------------------------------------------------------------------

window.app.directive("songDisplay", function()
{
    return {
        restrict: "E",
        templateUrl: "/flatpages/partials/playing.html",
        scope: {
            song: "=",
            isCurrent: "=",
            currentPos: "="
        },
        controller: function($scope) {
            $scope.calculateDurationProgress = function(current, duration)
            {
                if(current)
                {
                    return Math.floor((current / duration) * 100);
                } // end if

                return 0;
            }; // end calculateProgress
        }
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Filters
//----------------------------------------------------------------------------------------------------------------------

window.app.filter("prettyTime", function()
{
    return function(time) {
        if(!time)
        {
            return "0:00";
        } // end if

        var minutes = Math.floor(time / 60);
        var seconds = time - (minutes * 60);

        if(String(seconds).length < 2)
        {
            seconds = "0" + seconds;
        } // end if

        return "" + minutes + ":" + seconds;
    };
});

//----------------------------------------------------------------------------------------------------------------------

