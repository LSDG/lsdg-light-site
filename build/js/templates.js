angular.module('lightsite.templates', ['/flatpages/playlist.html']);

angular.module("/flatpages/playlist.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/flatpages/playlist.html",
    "<h2>Playlist goes here.</h2>");
}]);
