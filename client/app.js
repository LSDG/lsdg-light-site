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
    }])
    .run(['$rootScope', function($rootScope)
    {
        $rootScope.songList = [
            {
                title: "The Night Santa Went Crazy",
                artist: "\"Weird Al\" Yankovic",
                duration: 243,
                image: {
                    small: 'http://ecx.images-amazon.com/images/I/51ZJjk4vPEL._AA160_.jpg',
                    medium: 'http://ecx.images-amazon.com/images/I/51ZJjk4vPEL._AA160_.jpg',
                    large: 'http://ecx.images-amazon.com/images/I/51ZJjk4vPEL._AA160_.jpg'
                }
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
                }
            },
            {
                title: "Winter Wizard (Instrumental)",
                artist: "Trans-Siberian Orchestra",
                duration: 185,
                image: {
                    small: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
                    medium: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
                    large: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg'
                }
            },
            {
                title: "White Christmas",
                artist: "Bing Crosby",
                duration: 183,
                image: {
                    small: 'http://ecx.images-amazon.com/images/I/51W6mPwureL._AA110_.jpg',
                    medium: 'http://ecx.images-amazon.com/images/I/51W6mPwureL._AA110_.jpg',
                    large: 'http://ecx.images-amazon.com/images/I/51W6mPwureL._AA110_.jpg'
                }
            },
            {
                title: "Oh Come All Ye Faithful",
                artist: "Jeremy Camp",
                duration: 198,
                image: {
                    small: 'http://ecx.images-amazon.com/images/I/51GajV6Vj1L._SL500_AA280_.jpg',
                    medium: 'http://ecx.images-amazon.com/images/I/51GajV6Vj1L._SL500_AA280_.jpg',
                    large: 'http://ecx.images-amazon.com/images/I/51GajV6Vj1L._SL500_AA280_.jpg'
                }
            }
        ];
    }]);

//----------------------------------------------------------------------------------------------------------------------
// Filters
//----------------------------------------------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------------------------------------------

