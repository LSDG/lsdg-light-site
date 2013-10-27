//----------------------------------------------------------------------------------------------------------------------
// Controllers for the lsdg lights project
//
// @module controllers.js
//----------------------------------------------------------------------------------------------------------------------

module = angular.module("lightsite.controllers", []);

//----------------------------------------------------------------------------------------------------------------------

module.controller("PlaylistCtrl", ["$scope", function($scope)
{
    $scope.currentSong = {
        title: "Jingle Bell Rock",
        artist: "Bobby Helms",
        currentTime: 98,
        duration: 120,
        image: {
            small: 'http://ecx.images-amazon.com/images/I/51s4JEPj15L._AA160_.jpg',
            medium: 'http://ecx.images-amazon.com/images/I/51s4JEPj15L._AA160_.jpg',
            large: 'http://ecx.images-amazon.com/images/I/51s4JEPj15L._AA160_.jpg'
        }
    };

    $scope.nextSong = {
        title: "Winter Wizard (Instrumental)",
        artist: "Trans-Siberian Orchestra",
        duration: 185,
        image: {
            small: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
            medium: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
            large: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg'
        }
    };

    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.calculateDurationProgress = function(current, duration)
    {
        if(current)
        {
            return Math.floor((current / duration) * 100);
        } // end if

        return 0;
    }; // end calculateProgress
}]);

//----------------------------------------------------------------------------------------------------------------------

