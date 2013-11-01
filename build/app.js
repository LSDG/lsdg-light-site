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

        $rootScope.socket = io.connect("http://localhost:8080/songctrl");

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

