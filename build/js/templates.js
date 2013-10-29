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
    "        <div class=\"progress\" ng-if=\"calculateDurationProgress(song.currentTime, song.duration)\">\n" +
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
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <h4>Request Queue:</h4>\n" +
    "                        <ul class=\"list-group\">\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <b>No songs queued.</b>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4\">\n" +
    "                        <h4>Available Songs:</h4>\n" +
    "                        <ul class=\"list-group text-left\">\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <img src=\"http://ecx.images-amazon.com/images/I/51ZJjk4vPEL._AA160_.jpg\" width=\"32\">\n" +
    "                                The Night Santa went Crazy\n" +
    "                                <button class=\"btn btn-default btn-small pull-right\"><i class=\"icon-plus\"></i> Request</button>\n" +
    "                                <span class=\"clearfix\"></span>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item active\">\n" +
    "                                <img src=\"http://ecx.images-amazon.com/images/I/51s4JEPj15L._AA160_.jpg\" width=\"32\">\n" +
    "                                Jingle Bell Rock\n" +
    "                                <div class=\"pull-right playing-text\"><i class=\"icon-play\"></i> Playing</div>\n" +
    "                                <span class=\"clearfix\"></span>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <img src=\"http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg\" width=\"32\">\n" +
    "                                Winter Wizard (Instrumental)\n" +
    "                                <button class=\"btn btn-default btn-small pull-right\"><i class=\"icon-plus\"></i> Request</button>\n" +
    "                                <span class=\"clearfix\"></span>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <img src=\"http://ecx.images-amazon.com/images/I/51W6mPwureL._AA110_.jpg\" width=\"32\">\n" +
    "                                White Christmas\n" +
    "                                <button class=\"btn btn-default btn-small pull-right\"><i class=\"icon-plus\"></i> Request</button>\n" +
    "                                <span class=\"clearfix\"></span>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <img src=\"http://ecx.images-amazon.com/images/I/51GajV6Vj1L._SL500_AA280_.jpg\" width=\"32\">\n" +
    "                                Oh Come All Ye Faithful\n" +
    "                                <button class=\"btn btn-default btn-small pull-right\"><i class=\"icon-plus\"></i> Request</button>\n" +
    "                                <span class=\"clearfix\"></span>\n" +
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
