//----------------------------------------------------------------------------------------------------------------------
// Controllers for the lsdg lights project
//
// @module controllers.js
//----------------------------------------------------------------------------------------------------------------------

module = angular.module("lightsite.controllers", []);

//----------------------------------------------------------------------------------------------------------------------

module.controller("PlaylistCtrl", ["$scope", function($scope)
{
    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.getCurrentSong = function()
    {
        return $scope.songList[$scope.currentSong];
    }; // end getCurrentSong

    $scope.getNextSong = function()
    {
        if ($scope.requestedSongs.length > 0)
        {
            return $scope.requestedSongs[0];
        } // end if

        var nextSongIdx = $scope.currentSong + 1;
        return $scope.songList[nextSongIdx];
    }; // end getNextSong

}]);

//----------------------------------------------------------------------------------------------------------------------

module.controller("RequestQueueCtrl", ["$scope", function($scope)
{
    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.queueSong = function(songIdx)
    {
        var song = $scope.songList[songIdx];
        $scope.socket.emit('request song', { song: song.filename });

    }; // end queueSong

    $scope.removeSong = function(songIdx)
    {
        $scope.socket.emit('remove request', { song: songIdx });
    }; // end removeSong

    $scope.isInQueue = function(song)
    {
        for(var idx = 0; idx < $scope.requestedSongs.length; idx++)
        {
            var listSong = $scope.requestedSongs[idx];
            if(song.title == $scope.requestedSongs[idx].title && song.artist == $scope.requestedSongs[idx].artist)
            {
                return true;
            } // end if
        } // end for

        return false;
    }; // end isInQueue

}]);

//----------------------------------------------------------------------------------------------------------------------

