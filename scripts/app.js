Parse.initialize('EmxeEeMgQxwUeC42hDPXfHK0tnKoTcLSL5OeZsuy', 'p8cryLkuriL0mTlWCmiKMmy0zRbYeMhGJ5YQFG6k');

      window.initPlayer = function(videoId) {
        $('#video-container').tubular({
          videoId: videoId,
          mute: false,
          repeat: false
        });

        var oldOnPlayerReady = window.onPlayerReady;
        window.onPlayerReady = function(e) {
          oldOnPlayerReady(e);

        $(window).keypress(function(e) {
            if (e.keyCode === 0 || e.keyCode === 32) {
                // Dont pause if the user is typing text in an input
                if (e.target.nodeName === 'INPUT') {
                    return;
                }
                if (window.player.B.playerState == 1) // playing
                    window.player.pauseVideo();
                else if (window.player.B.playerState == 2) // paused
                    window.player.playVideo();
            }
        });
    }

    var oldOnPlayerStateChange = window.onPlayerStateChange;
    window.onPlayerStateChange = function (event) {
        oldOnPlayerStateChange(event);
        if (window.player.B.playerState == 0) { // stopped
            var topVideo = window.playlist.getTopVideo();
            window.playlist.removeVideo(topVideo.id);
        }
        // else if (window.player.B.playerState == 1) // playing
    }
}

window.playNext = function() {
    console.log('play next ');

    var currentVideo = window.playlist.getTopVideo();
    if (!currentVideo) {
        return;
    }
    currentVideoId = currentVideo.get('videoId');
    window.playlist.markAsCurrent(currentVideo);

    // announce for 2 seconds
    window.readme("And now... " + currentVideo.get('videoTitle') + "!");
    setTimeout(function() {
        if (window.player === undefined) {
            window.initPlayer(currentVideoId);
            window.onYouTubeIframeAPIReady();
        }
        else {
            window.player.loadVideoById(currentVideoId);
        }
    }, 2000);
}

// Skip video when they hit the right arrow key
document.addEventListener('keyup', function (event) {
    if (event.keyCode === 39) {
        var currentVideo = window.playlist.getTopVideo();
        // If no video, don't skip
        // also don't skip if they're just moving arrow key in input element
        if (!currentVideo || event.target.nodeName === 'INPUT') {
            return;
        }
        window.playlist.removeVideo(currentVideo.id);
    }
});
