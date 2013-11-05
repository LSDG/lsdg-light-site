//----------------------------------------------------------------------------------------------------------------------
// Controllers for the lsdg lights project
//
// @module controllers.js
//----------------------------------------------------------------------------------------------------------------------

module = angular.module("lightsite.controllers", []);

//----------------------------------------------------------------------------------------------------------------------

module.controller("PlaylistCtrl", ["$scope", function($scope)
{
    // TODO: Either find a use for this, or remove it.
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

        // Record that we've requested the particular song
        var requested = $scope.getCookie("requested");
        requested.push(song.filename);
        $scope.setCookie("requested", requested);

        // Let the server know about the song we requested.
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

