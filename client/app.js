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
            .when('/', {templateUrl: '/flatpages/playlist.html', controller: 'PlaylistCtrl'})
            .otherwise({redirectTo: '/'});
    }]);

window.app.filter("prettyTime", function()
{
    return function(time) {
        if(!time)
        {
            return "";
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

