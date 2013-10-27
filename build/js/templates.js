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
    "            <small>{{ song.currentTime | prettyTime }}<span ng-if=\"song.currentTime\">/</span>{{ song.duration | prettyTime }}</small>\n" +
    "        </div>\n" +
    "        <small class=\"artist\">{{ song.artist }}</small>\n" +
    "        <div class=\"progress\">\n" +
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
    "                    <div class=\"col-md-8\" ng-include=\"'/flatpages/partials/playing.html'\" ng-init=\"song = currentSong\"></div>\n" +
    "                    <div class=\"col-md-4 up-next visible-md visible-lg\" ng-include=\"'/flatpages/partials/playing.html'\" ng-init=\"song = nextSong\"></div>\n" +
    "                    <div class=\"col-md-8 hidden-md hidden-lg\" ng-init=\"song = nextSong\">\n" +
    "                        <small><strong>Up Next:</strong> {{ song.artist }} - {{ song.title }}</small>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body text-center\">\n" +
    "                <b>No songs queued.</b>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
