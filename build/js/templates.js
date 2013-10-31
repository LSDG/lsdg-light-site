angular.module('lightsite.templates', ['/flatpages/partials/playing.html', '/flatpages/playlist.html']);

angular.module("/flatpages/partials/playing.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/flatpages/partials/playing.html",
    "<div class=\"media now-playing\">\n" +
    "    <a class=\"pull-left\" href=\"#\">\n" +
    "        <img class=\"media-object cover\" src=\"{{ song.image.medium }}\" alt=\"{{ song.title }}\">\n" +
    "    </a>\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading track-title\">{{ song.title }}</h4>\n" +
    "        <div class=\"pull-right\">\n" +
    "            <small>\n" +
    "                <span ng-if=\"isCurrent\">{{ song.currentTime | prettyTime }} /</span>\n" +
    "                {{ song.duration | prettyTime }}\n" +
    "            </small>\n" +
    "        </div>\n" +
    "        <small class=\"artist\">{{ song.artist }}</small>\n" +
    "        <div class=\"progress\" ng-if=\"isCurrent\">\n" +
    "            <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{ calculateDurationProgress(song.currentTime, song.duration) }}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{ calculateDurationProgress(song.currentTime, song.duration) }}%;\">\n" +
    "                <span class=\"sr-only\">{{ calculateDurationProgress(song.currentTime, song.duration) }} Complete</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/flatpages/playlist.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/flatpages/playlist.html",
    "<div class=\"row playlist\">\n" +
    "    <div class=\"panel-spacer col-xs-12\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <div class=\"row\">\n" +
    "                    <song-display  class=\"col-md-8\" song=\"getCurrentSong()\" is-current=\"true\"></song-display>\n" +
    "                    <song-display  class=\"col-md-4 up-next visible-md visible-lg\" song=\"getNextSong()\"></song-display>\n" +
    "                    <div class=\"col-md-8 hidden-md hidden-lg\">\n" +
    "                        <small><strong>Up Next:</strong> {{ getNextSong().artist }} - {{ getNextSong().title }}</small>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\" ng-controller=\"RequestQueueCtrl\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <h4 class=\"text-center\">Request Queue:</h4>\n" +
    "                        <ul class=\"list-group requested-songs\">\n" +
    "                            <li ng-if=\"requestedSongs.length == 0\" class=\"list-group-item text-center\">\n" +
    "                                <b>No songs queued.</b>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"song in requestedSongs\">\n" +
    "                                <img class=\"album\" ng-attr-src=\"{{ song.image.small }}\">\n" +
    "                                <span class=\"title\">{{ song.title }}</span>\n" +
    "                                <button type=\"button\" class=\"close\" aria-hidden=\"true\" ng-click=\"removeSong($index)\">&times;</button>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4\">\n" +
    "                        <h4 class=\"text-center\">Available Songs:</h4>\n" +
    "                        <ul class=\"list-group available-songs\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"song in songList\" ng-class=\"{ active: $index == currentSong }\">\n" +
    "                                <img class=\"album\" ng-attr-src=\"{{ song.image.small }}\">\n" +
    "                                <span class=\"title\" ng-class=\"{ requested: isInQueue(song) }\">{{ song.title }}</span>\n" +
    "                                <button ng-if=\"$index != currentSong\"\n" +
    "                                        class=\"btn btn-default btn-small request\"\n" +
    "                                        ng-click=\"queueSong($index)\"\n" +
    "                                        ng-class=\"{ disabled: isInQueue(song) }\">\n" +
    "                                    <i class=\"icon-plus\"></i>\n" +
    "                                    <span ng-if=\"!isInQueue(song)\">Request</span>\n" +
    "                                    <span ng-if=\"isInQueue(song)\">Requested</span>\n" +
    "                                </button>\n" +
    "                                <div ng-if=\"$index == currentSong\" class=\"request playing-text\"><i class=\"icon-play\"></i> Playing</div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
