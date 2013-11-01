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
        $rootScope.requestedSongs = [];
        $rootScope.songList = [];

        //--------------------------------------------------------------------------------------------------------------
        // State Control
        //--------------------------------------------------------------------------------------------------------------

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
            for(var idx = 0; idx < $rootScope.songList.length; idx++ )
            {
                var songIdx = $rootScope.songList[idx];
                if(songIdx.filename == song.filename)
                {
                    return idx;
                } // end if
            } // end for
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
            console.log('Song finished!');

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

        // When we connect, we need to figure out what the current status is, and update ourselves correctly.
        $rootScope.socket.on('connect', function()
        {
            $rootScope.socket.emit('list songs', function(data)
            {
                $rootScope.$apply(function(){
                    $rootScope.songList = data.songs;
                });

                $rootScope.socket.emit('get status', function(data) {
                    $rootScope.$apply(function()
                    {
                        //TODO: Do something with this information!
                    });
                });
            });

            $rootScope.socket.emit('list requested songs', function(data)
            {
                $rootScope.$apply(function(){
                    $rootScope.requestedSongs = data.songs;
                });
            });
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
            isCurrent: "="
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

